import chalk from 'chalk';
import { sql } from 'drizzle-orm';
import { type ResolvedRawElement } from '@jsprose/core';
import type { ContentProseType } from '@erudit-js/core/content/prose';
import type { ResolvedEruditRawElement } from '@erudit-js/prose';
import type {
  ContentLinks,
  ContentLinkUsage,
} from '@erudit-js/prose/elements/link/step';

export async function insertContentResolved(
  contentFullId: string,
  contentProseType: ContentProseType,
  resolveResult: ResolvedRawElement & ResolvedEruditRawElement,
) {
  for (const file of resolveResult.files) {
    await ERUDIT.repository.db.pushFile(file, `content-item:${contentFullId}`);
  }

  for (const [uniqueName, unique] of Object.entries(resolveResult.uniques)) {
    await ERUDIT.db.insert(ERUDIT.db.schema.contentUniques).values({
      contentFullId,
      contentProseType,
      uniqueName,
      title: resolveResult.uniqueTitles[uniqueName],
      prose: unique,
    });
  }

  for (const snippet of resolveResult.snippets) {
    await ERUDIT.db.insert(ERUDIT.db.schema.contentSnippets).values({
      contentFullId,
      contentProseType,
      elementId: snippet.elementId,
      schemaName: snippet.schemaName,
      snippetData: snippet.snippetData,
      search: !!snippet.snippetData.search,
      quick: !!snippet.snippetData.quick,
      seo: !!snippet.snippetData.seo,
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

  for (const problemScript of resolveResult.problemScripts) {
    await ERUDIT.repository.db.pushProblemScript(problemScript, contentFullId);
  }

  const targetFullIds = filterTargetFullIds(
    contentFullId,
    resolveResult.contentLinks,
  );

  await insertContentDeps(contentFullId, Array.from(targetFullIds));
}

async function insertContentDeps(fromFullId: string, toFullIds: string[]) {
  const contentDeps = toFullIds
    .filter((toFullId) => toFullId !== fromFullId)
    .map((toFullId) => ({
      fromFullId,
      toFullId,
      hard: false,
    }));

  if (contentDeps.length > 0) {
    await ERUDIT.db
      .insert(ERUDIT.db.schema.contentDeps)
      .values(contentDeps)
      .onConflictDoNothing();
  }
}

function filterTargetFullIds(
  contentFullId: string,
  contentLinks: ContentLinks,
) {
  const brokenLinkMessage = (message: string, metas: ContentLinkUsage[]) => {
    let output = `${message} in ${ERUDIT.log.stress(contentFullId)}:\n`;
    for (const { type, label } of metas) {
      output += `  ${chalk.gray('➔')}  <${type}>${label}</${type}>\n`;
    }
    return output;
  };

  const targetFullIds = new Set<string>();

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
        targetFullIds.add(globalContentToNavNode(globalContentId).fullId);
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

  return targetFullIds;
}

function globalContentToNavNode(globalContentPath: string) {
  const parts = globalContentPath.split('/');

  if (parts.at(-1)?.startsWith('$')) {
    parts.pop();
  }

  const navNode =
    ERUDIT.contentNav.getNode(parts.join('/')) ??
    ERUDIT.contentNav.getNodeOrThrow(parts.slice(0, -1).join('/'));

  return navNode;
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
