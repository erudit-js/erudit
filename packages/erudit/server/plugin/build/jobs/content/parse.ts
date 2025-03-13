import { ElementNode, walkForward } from '@bitran-js/core';
import { type BitranTranspiler } from '@bitran-js/transpiler';

import {
    mergeAliases,
    NO_ALIASES,
    stringifyBitranLocation,
    type BitranContext,
    type BitranLocation,
} from '@erudit-js/cog/schema';
import { AliasesNode } from '@erudit-js/bitran-elements/aliases/shared';
import { HeadingNode } from '@erudit-js/bitran-elements/heading/shared';

import { createBitranTranspiler } from '@server/bitran/transpiler';
import { ERUDIT_SERVER } from '@server/global';
import { DbUnique } from '@server/db/entities/Unique';

let context: BitranContext = {} as any;
let bitranTranspiler: BitranTranspiler;

const blocksAfterHeading = 2;

export async function parseBitranContent(
    location: BitranLocation,
    biCode: string,
) {
    // Reset Bitran context in order not to create core each time
    context.location = location;
    context.aliases = NO_ALIASES();

    bitranTranspiler ||= await createBitranTranspiler();

    // Tracking heading nodes to deal with them later
    const headings: HeadingNode[] = [];

    await bitranTranspiler.parser.parse(biCode, {
        async step(node) {
            const meta = node.meta;
            const uniqueId = meta?.id;

            if (node instanceof AliasesNode) {
                mergeAliases(context.aliases, node.parseData);
            }

            if (uniqueId) {
                if (node instanceof HeadingNode) {
                    headings.push(node);
                    return;
                }

                await addUnique(node);
            }
        },
    });

    for (const heading of headings) {
        let blocksAfter = 0;
        let content = await bitranTranspiler.stringifier.stringify(heading);

        await walkForward(heading, async (node) => {
            if (blocksAfter >= blocksAfterHeading) return false;

            if (node instanceof AliasesNode) return;
            // Spoiler
            // Todo

            content +=
                '\n\n' + (await bitranTranspiler.stringifier.stringify(node));

            blocksAfter++;
        });

        await addUnique(heading, content);
    }

    //
    //
    //

    function createUniqueLocation(node: ElementNode) {
        return stringifyBitranLocation({
            ...location,
            ...{ unique: node.meta.id! },
        });
    }

    async function addUnique(node: ElementNode, content?: string) {
        const dbUnique = new DbUnique();
        dbUnique.location = createUniqueLocation(node);
        dbUnique.content =
            content || (await bitranTranspiler.stringifier.stringify(node));
        dbUnique.title = node.parseData?.title || node.meta?.title;
        dbUnique.productName = node.name;
        dbUnique.context = context;

        await ERUDIT_SERVER.DB.manager.save(dbUnique);
    }
}
