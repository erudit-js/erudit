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
import { DetailsNode } from '@erudit-js/bitran-elements/details/shared';
import { HeadingNode } from '@erudit-js/bitran-elements/heading/shared';
import {
    problemName,
    ProblemNode,
    problemsName,
    ProblemsNode,
    type ProblemParseData,
    type ProblemsParseData,
} from '@erudit-js/bitran-elements/problem/shared';

import { createBitranTranspiler } from '@server/bitran/transpiler';
import { ERUDIT_SERVER } from '@server/global';
import { DbUnique } from '@server/db/entities/Unique';
import { DbQuickLink } from '@erudit/server/plugin/db/entities/QuickLink';
import { logger } from '@server/logger';
import { DbStat } from '@erudit/server/plugin/db/entities/Stat';

let context: BitranContext = {} as any;
let bitranTranspiler: BitranTranspiler;
let stats: Record<string, number> = {};

const blocksAfterHeading = 2;

export async function parseBitranContent(
    location: BitranLocation,
    biCode: string,
) {
    // Reset
    context.location = location;
    context.aliases = NO_ALIASES();
    stats = {};

    bitranTranspiler ||= await createBitranTranspiler({
        context,
        eruditConfig: ERUDIT_SERVER.CONFIG,
        insideInclude: false,
    });

    // Tracking heading nodes to deal with them later
    const headings: HeadingNode[] = [];

    await bitranTranspiler.parser.parse(biCode, {
        async step(node) {
            const meta = node.meta;
            const uniqueId = meta?.id;

            tryUpdateStats(node.name);
            await tryAddQuickLink(node);

            if (node instanceof AliasesNode) {
                mergeAliases(context.aliases, node.parseData);
            }

            if (uniqueId) {
                if (node instanceof HeadingNode) {
                    headings.push(node);
                    return;
                }

                if (node instanceof DetailsNode) {
                    await addUnique(
                        node,
                        await bitranTranspiler.stringifier.stringify(
                            node.parseData,
                        ),
                    );
                    return;
                }

                await addUnique(node);
            }
        },
    });

    await saveStats();

    for (const heading of headings) {
        let blocksAfter = 0;
        let content = await bitranTranspiler.stringifier.stringify(heading);

        await walkForward(heading, async (node) => {
            if (blocksAfter >= blocksAfterHeading) return false;

            if (node instanceof AliasesNode) return;
            if (node instanceof DetailsNode) return;
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

        dbUnique.title = node.parseData?.title || node.meta?.title || null;

        if (node instanceof ProblemNode || node instanceof ProblemsNode) {
            dbUnique.title = node.parseData.info.title;
        }

        dbUnique.productName = node.name;
        dbUnique.context = context;

        await ERUDIT_SERVER.DB.manager.save(dbUnique);
    }
}

function tryUpdateStats(elementName: string) {
    const trackedNames = (ERUDIT_SERVER.CONFIG?.bitran?.stat ?? []).flat();
    if (trackedNames.includes(elementName)) {
        stats[elementName] = (stats[elementName] || 0) + 1;
    }
}

async function saveStats() {
    for (const [elementName, count] of Object.entries(stats)) {
        const dbStat = new DbStat();
        dbStat.contentId = context.location.path!;
        dbStat.elementName = elementName;
        dbStat.count = count;
        await ERUDIT_SERVER.DB.manager.save(dbStat);
    }
}

async function tryAddQuickLink(element: ElementNode) {
    const linkProperty = element.meta?.link;
    if (linkProperty === undefined) return;

    let linkLabel: string | undefined;

    const linkCandidates = [
        linkProperty,
        element.parseData?.title,
        element.meta?.title,
    ];

    if (element.name === problemName || element.name === problemsName) {
        const problemParseData = element.parseData as
            | ProblemParseData
            | ProblemsParseData;
        linkCandidates.unshift(problemParseData.info.title);
    }

    for (const linkCandidate of linkCandidates) {
        if (typeof linkCandidate === 'string') {
            const _label = linkCandidate.trim();
            if (_label) {
                linkLabel = _label;
                break;
            }
        }
    }

    if (!linkLabel) {
        logger.warn(
            `Missing quick link label for element "${element.id}" at "${context.location.path!}"!`,
        );
        return;
    }

    const dbQuickLink = new DbQuickLink();
    dbQuickLink.label = linkLabel;
    dbQuickLink.elementName = element.name;
    dbQuickLink.elementId = element.id;
    dbQuickLink.contentId = context.location.path!;
    dbQuickLink.contentType = context.location.type;

    try {
        await ERUDIT_SERVER.DB.manager.insert(DbQuickLink, dbQuickLink);
    } catch (error) {
        logger.warn(
            `Failed to insert quick link "${linkLabel}" for element "${element.id}" at "${context.location.path!}"!`,
            'This is probably because the is already a quick link with same label!',
        );
    }
}
