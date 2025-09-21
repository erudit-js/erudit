import {
    ElementSchemaAny,
    ParsedElement,
    ParsedSnippet,
} from '@erudit-js/prose';
import { TopicPart } from '@erudit-js/cog/schema';

import { wrapError } from './error';

export async function insertUniques(
    fullId: string,
    topicPart: TopicPart | undefined,
    uniques: ParsedElement<ElementSchemaAny>[],
) {
    for (const unique of uniques) {
        try {
            await ERUDIT.db.insert(ERUDIT.db.schema.uniques).values({
                contentFullId: fullId,
                uniqueId: unique.uniqueId!,
                domId: unique.domId!,
                topicPart,
                parsedElement: unique,
            });
        } catch (error) {
            throw wrapError(error, `Inserting unique ${unique.uniqueId}!`);
        }
    }
}

export async function insertSnippets(
    fullId: string,
    topicPart: TopicPart | undefined,
    snippets: ParsedSnippet[],
) {
    for (const snippet of snippets) {
        try {
            await ERUDIT.db.insert(ERUDIT.db.schema.snippets).values({
                contentFullId: fullId,
                topicPart,
                domId: snippet.domId,
                elementName: snippet.elementName,
                quick: snippet.quick,
                search: snippet.search,
                title: snippet.title,
                description: snippet.description,
                synonyms: snippet.synonyms,
            });
        } catch (error) {
            throw wrapError(
                error,
                `Inserting snippet from tag <${snippet.tagName}>!`,
            );
        }
    }
}
