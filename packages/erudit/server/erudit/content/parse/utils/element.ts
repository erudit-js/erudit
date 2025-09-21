import { ElementSchemaAny, ParsedElement } from '@erudit-js/prose';
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
