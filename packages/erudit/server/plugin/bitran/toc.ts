import type { BitranLocation } from '@erudit-js/cog/schema';
import { type ElementNode } from '@bitran-js/core';
import { IncludeNode } from '@erudit-js/bitran-elements/include/shared';
import {
    headingName,
    HeadingNode,
} from '@erudit-js/bitran-elements/heading/shared';

import type { Toc } from '@erudit/shared/bitran/toc';
import { ERUDIT_SERVER } from '@server/global';
import { getRawBitranContent } from './content';
import { createBitranTranspiler } from './transpiler';
import { traverseInclude } from './products/include';

export async function getBitranToc(location: BitranLocation) {
    const rawContent = await getRawBitranContent(location);
    const bitranCore = await createBitranTranspiler();

    const toc: Toc = [];

    await bitranCore.parser.parse(rawContent.biCode, {
        async step(node) {
            if (node instanceof IncludeNode) {
                await traverseInclude(node, rawContent.context, {
                    step: async ({ _node }) => tryAddToToc(_node),
                });
            } else tryAddToToc(node);
        },
    });

    return toc;

    function tryAddToToc(node: ElementNode) {
        const tocItemBase = {
            id: node.id,
            productName: node.name,
        };

        // Check if node is manually excluded from TOC
        if (typeof node.meta?.toc === 'boolean' && !node.meta?.toc) return;

        if (node instanceof HeadingNode) {
            toc.push({
                ...tocItemBase,
                level: node.parseData.level,
                title: node.parseData.title,
            });
            return;
        }

        const notHeadingLevel = () => {
            // Toc items without heading are at top level
            if (toc.length === 0) return 0;

            const lastTocItem = toc.at(-1)!;

            // Going one level deep if previous item was a heading and copy deep level if not
            return lastTocItem.productName === headingName
                ? lastTocItem.level + 1
                : lastTocItem.level;
        };

        if (ERUDIT_SERVER.BITRAN_CONFIG?.toc?.includes(node.name)) {
            // Erudit Bitran config says to add these products to TOC
            toc.push({
                ...tocItemBase,
                level: notHeadingLevel(),
                title: node.meta?.title || node.parseData?.title,
            });
            return;
        }

        if (node.meta?.toc) {
            // Show in Toc any product with truthy `toc` meta property
            toc.push({
                ...tocItemBase,
                level: notHeadingLevel(),
                title: node.meta?.title || node.parseData?.title,
            });
            return;
        }
    }
}
