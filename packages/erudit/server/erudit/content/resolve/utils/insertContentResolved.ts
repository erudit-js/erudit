import { type ResolvedRawElement } from '@jsprose/core';
import type { ContentProseType } from '@erudit-js/core/content/prose';
import type { ResolvedEruditRawElement } from '@erudit-js/prose';

export async function insertContentResolved(
    contentFullId: string,
    contentProseType: ContentProseType,
    resolveResult: ResolvedRawElement & ResolvedEruditRawElement,
) {
    for (const file of resolveResult.files) {
        await ERUDIT.repository.db.pushFile(
            file,
            `content-item:${contentFullId}`,
        );
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
            search: Boolean(snippet.search),
            quick: Boolean(snippet.quick),
            title: snippet.title!,
            description: snippet.description,
            synonyms:
                typeof snippet.search === 'object'
                    ? snippet.search.synonyms
                    : undefined,
        });
    }

    for (const problemScript of resolveResult.problemScripts) {
        await ERUDIT.repository.db.pushProblemScript(
            problemScript,
            contentFullId,
        );
    }

    const fromFullIds = new Set(
        Array.from(resolveResult.dependencies)
            .map((dependency) => {
                if (dependency.startsWith('<link:')) {
                    const navNode = globalContentToNavNode(
                        dependency.replace(/^<link:.+>\//, ''),
                    );
                    return navNode.fullId;
                }
            })
            .filter((id): id is string => id !== undefined),
    );

    const contentDeps = Array.from(fromFullIds)
        .filter((fromFullId) => fromFullId !== contentFullId)
        .map((fromFullId) => ({
            fromFullId,
            toFullId: contentFullId,
            hard: false,
        }));

    if (contentDeps.length > 0) {
        await ERUDIT.db
            .insert(ERUDIT.db.schema.contentDeps)
            .values(contentDeps)
            .onConflictDoNothing();
    }
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
