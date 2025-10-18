import {
    ElementType,
    ElementWalk,
    walkElements,
    type ElementSchemaAny,
    type ParsedElement,
} from '@erudit-js/prose';
import {
    blocksName,
    type BlocksSchema,
} from '@erudit-js/prose/default/blocks/index';
import { headingName } from '@erudit-js/prose/default/heading/index';

import type { ContentNavNode } from '../../content/nav/types';

export async function getHeadingUniqueData(
    navNode: ContentNavNode,
    contentPath: string,
    uniqueSlug: string,
) {
    const proseBlocks = await ERUDIT.repository.prose.get(contentPath);

    const afterHeadingElements: ParsedElement<ElementSchemaAny>[] = [];
    let adding = false;

    await walkElements<ParsedElement<ElementSchemaAny>>(
        proseBlocks,
        async (element) => {
            if (
                element.name === headingName &&
                element.uniqueSlug === uniqueSlug
            ) {
                adding = true;
            }

            if (adding) {
                afterHeadingElements.push(element);

                if (afterHeadingElements.length === 4) {
                    adding = false;
                    return ElementWalk.Stop;
                }

                return ElementWalk.NoDeeper;
            }
        },
    );

    const blocks: ParsedElement<BlocksSchema> = {
        type: ElementType.Block,
        name: blocksName,
        // @ts-expect-error
        children: afterHeadingElements,
    };

    return await ERUDIT.repository.prose.resolve<BlocksSchema>(navNode, blocks);
}
