import { type ElementNode } from '@bitran-js/core';
import type { BitranLocation } from '@erudit-js/cog/schema';
import {
    headingName,
    HeadingNode,
} from '@erudit-js/bitran-elements/heading/shared';
import {
    ProblemNode,
    ProblemsNode,
} from '@erudit-js/bitran-elements/problem/shared';

import type { Toc } from '@erudit/shared/bitran/toc';
import { ERUDIT_SERVER } from '@server/global';
import { getBitranContent } from './content';
import { createBitranTranspiler } from './transpiler';

export async function getBitranToc(location: BitranLocation) {
    const content = await getBitranContent(location, false);
    const bitranCore = await createBitranTranspiler();

    const toc: Toc = [];

    await bitranCore.parser.parse(content.biCode, {
        async step(node) {
            tryAddToToc(node as ElementNode);
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
                level: node.parseData.level - 1,
                title: node.parseData.title,
            });
            return;
        }

        const notHeadingLevel = () => {
            // If TOC is empty, we're at the root level
            if (toc.length === 0) return 0;

            // Find the most recent heading to determine parent level
            for (let i = toc.length - 1; i >= 0; i--) {
                if (toc[i].productName === headingName) {
                    // Found a heading, return its level + 1
                    return toc[i].level + 1;
                }
            }

            // No heading found in TOC, place at root level
            return 0;
        };

        // Problems by default are in TOC
        if (node instanceof ProblemsNode || node instanceof ProblemNode) {
            toc.push({
                ...tocItemBase,
                level: notHeadingLevel(),
                title: node.meta?.title || node.parseData.info.title,
            });
            return;
        }

        if (
            ERUDIT_SERVER.CONFIG.bitran?.toc?.includes(node.name) ||
            node.meta?.toc
        ) {
            // Erudit Bitran config says to add these products to TOC
            // Or show in TOC any product with truthy `toc` meta property
            toc.push({
                ...tocItemBase,
                level: notHeadingLevel(),
                title: node.meta?.title || node.parseData?.title,
            });
            return;
        }
    }
}
