import type { ResolvedRawElement } from '@jsprose/core';
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

    // for (const link of resolveResult.links) {
    //     await ERUDIT.repository.db.pushProseLink(
    //         contentFullId,
    //         contentProseType,
    //         parseProseLink(link)!,
    //     );
    // }
}
