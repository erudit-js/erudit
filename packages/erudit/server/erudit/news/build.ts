import { existsSync } from 'node:fs';
import { inArray } from 'drizzle-orm';
import { globSync } from 'glob';
import type { AnySchema, RawElement } from '@jsprose/core';

import { resolveEruditProse } from '../prose/repository/resolve';

let initialBuild = true;

const newsRoot = () => ERUDIT.paths.project(`news`);

export async function buildNews() {
  ERUDIT.log.debug.start('Building news...');

  const isInitial = initialBuild;
  initialBuild = false;

  const newsFilenames = collectNewsFilenames(isInitial);

  if (!newsFilenames.size) {
    ERUDIT.log.info(
      isInitial
        ? 'Skipping news — no news found.'
        : 'Skipping news — nothing changed.',
    );
    return;
  }

  for (const filename of newsFilenames) {
    await cleanupNews(filename);
  }

  const existingFilenames = [...newsFilenames].filter((filename) =>
    existsSync(`${newsRoot()}/${filename}`),
  );

  if (!existingFilenames.length) {
    return;
  }

  for (const filename of existingFilenames) {
    await buildNewsItem(filename);
  }

  ERUDIT.log.success(
    isInitial
      ? `News build complete! (${ERUDIT.log.stress(newsFilenames.size)})`
      : `News updated: ${ERUDIT.log.stress(existingFilenames.join(', '))}`,
  );
}

//
//
//

function collectNewsFilenames(initial: boolean): Set<string> {
  if (initial) {
    return new Set(
      globSync(`[0-9][0-9][0-9][0-9].[0-9][0-9].[0-9][0-9].tsx`, {
        posix: true,
        cwd: newsRoot(),
      }),
    );
  }

  const filenames = new Set<string>();

  for (const file of ERUDIT.changedFiles.values()) {
    if (!file.startsWith(`${newsRoot()}/`)) continue;
    const relativePath = file.replace(`${newsRoot()}/`, '');

    if (relativePath.match(/^[0-9]{4}\.[0-9]{2}\.[0-9]{2}\.tsx$/)) {
      filenames.add(relativePath);
    }
  }

  return filenames;
}

async function cleanupNews(filename: string) {
  await ERUDIT.db
    .delete(ERUDIT.db.schema.news)
    .where(inArray(ERUDIT.db.schema.news.date, [filename.replace('.tsx', '')]));
}

async function buildNewsItem(filename: string) {
  ERUDIT.log.debug.start(
    `Building news item ${ERUDIT.log.stress(filename)}...`,
  );

  let newsModule: { default: RawElement<AnySchema> } | undefined;

  try {
    newsModule = await ERUDIT.import(`${newsRoot()}/${filename}`);
  } catch (err) {
    ERUDIT.log.error(`Failed to load news item ${filename}:`);
    console.error(err);
    return;
  }

  if (!newsModule?.default) {
    ERUDIT.log.error(`No default export in news item ${filename}`);
    return;
  }

  const resolvedProse = await resolveEruditProse(newsModule.default, false);

  await ERUDIT.db.insert(ERUDIT.db.schema.news).values({
    date: filename.replace('.tsx', ''),
    prose: resolvedProse.proseElement,
  });
}
