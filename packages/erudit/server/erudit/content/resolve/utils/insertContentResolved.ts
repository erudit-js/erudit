import chalk from 'chalk';
import { sql } from 'drizzle-orm';
import type { ContentProseType } from '@erudit-js/core/content/prose';
import { builtLinkObject } from '../../global/build';
import type {
  ContentLinks,
  ContentLinkUsage,
} from '@erudit-js/prose/elements/link/hook';
import {
  toKeySnippet,
  toSearchSnippet,
  toSeoSnippet,
  type EruditRawToProseResult,
} from '@erudit-js/prose';

export async function insertContentResolved(
  contentFullId: string,
  contentProseType: ContentProseType,
  result: EruditRawToProseResult,
) {
  for (const file of result.files) {
    await ERUDIT.repository.db.pushFile(file, `content-item:${contentFullId}`);
  }

  for (const [uniqueName, unique] of Object.entries(result.uniques)) {
    await ERUDIT.db.insert(ERUDIT.db.schema.contentUniques).values({
      contentFullId,
      contentProseType,
      uniqueName,
      title: result.uniqueTitles[uniqueName],
      prose: unique,
    });
  }

  for (const snippet of result.snippets) {
    await ERUDIT.db.insert(ERUDIT.db.schema.contentSnippets).values({
      contentFullId,
      contentProseType,
      elementId: snippet.elementId,
      schemaName: snippet.schemaName,
      snippetData: snippet.snippet,
      search: !!toSearchSnippet(snippet.snippet),
      key: !!toKeySnippet(snippet.snippet),
      seo: !!toSeoSnippet(snippet.snippet),
    });
  }

  // Deduplicate search flags for topic snippets
  if (
    contentProseType === 'article' ||
    contentProseType === 'summary' ||
    contentProseType === 'practice'
  ) {
    await deduplicateTopicSnippetsSearch(contentFullId);
  }

  for (const problemScript of result.problemScripts) {
    await ERUDIT.repository.db.pushProblemScript(problemScript, contentFullId);
  }

  const targetMap = filterTargetMap(contentFullId, result.contentLinks);

  await insertContentDeps(contentFullId, targetMap);
}

async function insertContentDeps(
  fromFullId: string,
  targetMap: Map<string, Set<string>>,
) {
  const contentDeps = Array.from(targetMap.entries())
    .filter(([toFullId]) => toFullId !== fromFullId)
    .map(([toFullId, uniqueSet]) => ({
      fromFullId,
      toFullId,
      hard: false,
      uniqueNames: uniqueSet.size > 0 ? Array.from(uniqueSet).join(',') : null,
    }));

  if (contentDeps.length > 0) {
    await ERUDIT.db
      .insert(ERUDIT.db.schema.contentDeps)
      .values(contentDeps)
      .onConflictDoNothing();
  }
}

// Returns a map from resolved toFullId → set of unique names targeted in that
// content item. An empty set means the dep targets the whole page (no unique).
function filterTargetMap(
  contentFullId: string,
  contentLinks: ContentLinks,
): Map<string, Set<string>> {
  const brokenLinkMessage = (message: string, metas: ContentLinkUsage[]) => {
    let output = `${message} in ${ERUDIT.log.stress(contentFullId)}:\n`;
    for (const { type, label } of metas) {
      output += `  ${chalk.gray('➔')}  <${type}>${label}</${type}>\n`;
    }
    return output;
  };

  const targetMap = new Map<string, Set<string>>();

  for (const [storageKey, metas] of contentLinks) {
    if (storageKey.startsWith('<link:unknown>/')) {
      ERUDIT.log.warn(
        brokenLinkMessage(
          `Unknown link ${chalk.red(storageKey.replace('<link:unknown>/', ''))}`,
          metas,
        ),
      );
    } else if (storageKey.startsWith('<link:global>')) {
      try {
        const globalContentId = storageKey.replace('<link:global>/', '');

        // Extract unique name before stripping it for nav resolution
        const parts = globalContentId.split('/');
        const lastPart = parts.at(-1);
        const uniqueName = lastPart?.startsWith('$')
          ? lastPart.slice(1)
          : undefined;

        const targetFullId = globalContentToNavNode(globalContentId).fullId;

        if (
          metas.some(
            (meta) => meta.type === 'Dep' || meta.type === 'Dependency',
          )
        ) {
          if (!targetMap.has(targetFullId)) {
            targetMap.set(targetFullId, new Set());
          }
          if (uniqueName) {
            targetMap.get(targetFullId)!.add(uniqueName);
          }
        }
      } catch {
        ERUDIT.log.warn(
          brokenLinkMessage(
            `Failed to resolve content link ${chalk.red(storageKey.replace('<link:global>/', ''))}`,
            metas,
          ),
        );
      }
    }
  }

  return targetMap;
}

function globalContentToNavNode(globalContentPath: string) {
  // Validate the full path (including any $unique suffix) against the link
  // object that was built from the source files. This catches broken unique
  // names as well as broken content paths before we ever touch the nav tree.
  if (builtLinkObject) {
    const parts = globalContentPath.split('/');
    let cursor: any = builtLinkObject;
    let valid = true;

    for (const part of parts) {
      if (!cursor || typeof cursor !== 'object' || !(part in cursor)) {
        valid = false;
        break;
      }
      cursor = cursor[part];
    }

    if (!valid) {
      throw new Error(`Path not found in \$CONTENT: ${globalContentPath}`);
    }
  }

  const parts = globalContentPath.split('/');

  if (parts.at(-1)?.startsWith('$')) {
    parts.pop();
  }

  // Path already validated against builtLinkObject, so if the exact node
  // isn't found the last segment must be a topic part — fall back to parent.
  return (
    ERUDIT.contentNav.getNode(parts.join('/')) ??
    ERUDIT.contentNav.getNodeOrThrow(parts.slice(0, -1).join('/'))
  );
}

async function deduplicateTopicSnippetsSearch(contentFullId: string) {
  // Disable search flag for duplicate snippets,
  // keeping the highest-priority one per (title, schemaName)
  await ERUDIT.db.run(sql`
    UPDATE contentSnippets
    SET search = 0
    WHERE snippetId IN (
      SELECT snippetId
      FROM (
        SELECT
          snippetId,
          ROW_NUMBER() OVER (
            PARTITION BY
              LOWER(TRIM(json_extract(snippetData, '$.title'))),
              schemaName
            ORDER BY
              CASE contentProseType
                WHEN 'article' THEN 0
                WHEN 'summary' THEN 1
                WHEN 'practice' THEN 2
                ELSE 99
              END
          ) AS rn
        FROM contentSnippets
        WHERE
          contentFullId = ${contentFullId}
          AND json_extract(snippetData, '$.title') IS NOT NULL
          AND search = 1
      )
      WHERE rn > 1
    );
  `);
}
