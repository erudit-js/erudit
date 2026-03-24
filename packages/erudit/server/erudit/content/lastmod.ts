import { spawnSync } from 'node:child_process';
import { eq } from 'drizzle-orm';
import type { LastmodProvider } from '@erudit-js/core/eruditConfig/lastmod';

export async function buildContentLastmod() {
  const lastmodConfig = ERUDIT.config.lastmod;

  if (!lastmodConfig) {
    return;
  }

  ERUDIT.log.debug.start('Collecting lastmod dates...');

  let collected = false;

  if (lastmodConfig.type === 'git') {
    collected = await collectGitLastmod();
  } else if (lastmodConfig.type === 'custom' && lastmodConfig.scriptPath) {
    collected = await collectCustomLastmod(lastmodConfig.scriptPath);
  }

  if (collected) {
    ERUDIT.log.success('Lastmod dates collected!');
  }
}

function getGitContentPrefix(): string | undefined {
  const projectRoot = ERUDIT.paths.project();

  const result = spawnSync('git', ['rev-parse', '--show-prefix'], {
    cwd: projectRoot,
    encoding: 'utf-8',
  });

  if (result.status !== 0) return undefined;

  // gitPrefix is e.g. "playground/" or "" (if project is at repo root)
  return result.stdout.trim() + 'content/';
}

async function collectGitLastmod(): Promise<boolean> {
  const projectRoot = ERUDIT.paths.project();
  const contentPrefix = getGitContentPrefix();

  if (!contentPrefix) {
    ERUDIT.log.warn(
      'Failed to detect git prefix — lastmod dates will be unavailable. ' +
        'Is this a git repository?',
    );
    return false;
  }

  const result = spawnSync(
    'git',
    ['log', '--format=format:%cI', '--name-only', '--', contentPrefix],
    {
      cwd: projectRoot,
      encoding: 'utf-8',
      maxBuffer: 50 * 1024 * 1024,
    },
  );

  if (result.status !== 0) {
    ERUDIT.log.warn(
      'Failed to run git log — lastmod dates will be unavailable. ' +
        'Is this a git repository?',
    );
    return false;
  }

  const stdout = result.stdout;

  if (!stdout.trim()) {
    return false;
  }

  // Parse git log output: blocks separated by double newlines
  // Each block: first line = ISO date, remaining lines = file paths
  const dateMap = new Map<string, string>();
  const blocks = stdout.split('\n\n');

  for (const block of blocks) {
    const lines = block.split('\n').filter(Boolean);
    if (lines.length < 2) continue;

    const date = lines[0]!;
    for (let i = 1; i < lines.length; i++) {
      const filePath = lines[i]!;
      if (!filePath.startsWith(contentPrefix)) continue;

      // Strip the prefix to get the content-relative path
      // e.g. "playground/content/1-test/page.tsx" → "1-test"
      const relPath = filePath.slice(contentPrefix.length);
      const lastSlash = relPath.lastIndexOf('/');
      const contentRelPath =
        lastSlash > 0 ? relPath.slice(0, lastSlash) : relPath;

      // Keep only the first (most recent) date per path
      if (!dateMap.has(contentRelPath)) {
        dateMap.set(contentRelPath, date);
      }
    }
  }

  // Detect shallow clone: if all dates are identical, warn
  if (dateMap.size > 1) {
    const dates = new Set(dateMap.values());
    if (dates.size === 1) {
      ERUDIT.log.warn(
        'All git lastmod dates are identical — this likely means a shallow clone. ' +
          'Use "fetch-depth: 0" in GitHub Actions checkout for accurate dates.',
      );
    }
  }

  // Build a map keyed by fullId from the contentRelPath-keyed dateMap
  const ownDates = new Map<string, string>();
  for (const [, navNode] of ERUDIT.contentNav.id2Node) {
    const date = dateMap.get(navNode.contentRelPath);
    if (date) {
      ownDates.set(navNode.fullId, date);
    }
  }

  await propagateAndSave(ownDates);
  return true;
}

async function collectCustomLastmod(absPath: string): Promise<boolean> {
  let provider: LastmodProvider;

  try {
    const module = await ERUDIT.import(absPath);
    provider = (module as any).default;
  } catch (error) {
    ERUDIT.log.warn(
      `Failed to import lastmod provider from "${absPath}":\n${error}`,
    );
    return false;
  }

  if (typeof provider !== 'function') {
    ERUDIT.log.warn(
      `Lastmod provider at "${absPath}" does not have a default-exported function!`,
    );
    return false;
  }

  // Collect dates from custom provider
  const customDates = new Map<string, string>();

  for (const [, navNode] of ERUDIT.contentNav.id2Node) {
    try {
      const date = await provider({
        fullId: navNode.fullId,
        mode: ERUDIT.mode,
        projectPath: ERUDIT.paths.project(),
      });
      if (date instanceof Date && !isNaN(date.getTime())) {
        customDates.set(navNode.fullId, date.toISOString());
      }
    } catch (error) {
      ERUDIT.log.warn(
        `Lastmod provider error for "${navNode.fullId}": ${error}`,
      );
    }
  }

  await propagateAndSave(customDates);
  return true;
}

/**
 * Propagate dates upward through the nav tree (parents inherit the most
 * recent date from their children) and write resolved dates to the DB.
 */
async function propagateAndSave(ownDates: Map<string, string>) {
  // Process deepest nodes first so child dates are finalized before parents
  const sortedNodes = Array.from(ERUDIT.contentNav.id2Node.values()).sort(
    (a, b) => b.fullId.split('/').length - a.fullId.split('/').length,
  );

  const resolvedDates = new Map<string, string>();

  for (const navNode of sortedNodes) {
    let bestDate = ownDates.get(navNode.fullId);

    for (const child of navNode.children ?? []) {
      const childDate = resolvedDates.get(child.fullId);
      if (childDate && (!bestDate || childDate > bestDate)) {
        bestDate = childDate;
      }
    }

    if (bestDate) {
      resolvedDates.set(navNode.fullId, bestDate);
    }
  }

  for (const [fullId, date] of resolvedDates) {
    await ERUDIT.db
      .update(ERUDIT.db.schema.content)
      .set({ lastmod: date })
      .where(eq(ERUDIT.db.schema.content.fullId, fullId));
  }
}
