import { styleText } from 'node:util';
import { sql } from 'drizzle-orm';
import type { ContentProseType } from '@erudit-js/core/content/prose';
import { builtValidPaths } from '../../global/build';
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
      .onConflictDoUpdate({
        target: [
          ERUDIT.db.schema.contentDeps.fromFullId,
          ERUDIT.db.schema.contentDeps.toFullId,
        ],
        set: {
          // Merge unique names from the auto dep into the existing row
          // (which may already be a hard dep that has no uniqueNames yet).
          // Only uniqueNames is updated — hard/reason are left untouched.
          uniqueNames: sql`CASE
            WHEN ${ERUDIT.db.schema.contentDeps.uniqueNames} IS NULL
              THEN excluded.uniqueNames
            WHEN excluded.uniqueNames IS NULL
              THEN ${ERUDIT.db.schema.contentDeps.uniqueNames}
            ELSE ${ERUDIT.db.schema.contentDeps.uniqueNames} || ',' || excluded.uniqueNames
          END`,
        },
      });
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
      output += `  ${styleText('gray', '➔')}  <${type}>${label}</${type}>\n`;
    }
    return output;
  };

  const targetMap = new Map<string, Set<string>>();

  for (const [storageKey, metas] of contentLinks) {
    if (storageKey.startsWith('<link:unknown>/')) {
      ERUDIT.log.warn(
        brokenLinkMessage(
          `Unknown link ${styleText('red', storageKey.replace('<link:unknown>/', ''))}`,
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
            `Failed to resolve content link ${styleText('red', storageKey.replace('<link:global>/', ''))}`,
            metas,
          ),
        );
      }
    }
  }

  return targetMap;
}

function globalContentToNavNode(globalContentPath: string) {
  // Validate the full path (including any $unique suffix) against the complete
  // set of known valid paths built from source files. This catches broken
  // unique names and content paths before we ever touch the nav tree.
  if (builtValidPaths && !builtValidPaths.has(globalContentPath)) {
    throw new Error(`Path not found in \$CONTENT: ${globalContentPath}`);
  }

  const parts = globalContentPath.split('/');

  if (parts.at(-1)?.startsWith('$')) {
    parts.pop();
  }

  // If the exact node isn't found the last segment is a topic part — fall back to parent.
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
