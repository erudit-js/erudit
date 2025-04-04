import { createPreRenderData, type PreRenderData } from '@bitran-js/transpiler';
import {
    BlockErrorNode,
    BlockNode,
    BlocksNode,
    InlinerErrorNode,
} from '@bitran-js/core';

import {
    isTopicPart,
    mergeAliases,
    NO_ALIASES,
    setEruditBitranRuntime,
    stringifyBitranLocation,
    type BitranContext,
    type BitranLocation,
    type EruditBitranRuntime,
    type TopicPart,
} from '@erudit-js/cog/schema';
import { AliasesNode } from '@erudit-js/bitran-elements/aliases/shared';
import { IncludeNode } from '@erudit-js/bitran-elements/include/shared';

import { ERUDIT_SERVER } from '@server/global';
import { DbUnique } from '@server/db/entities/Unique';
import { DbTopic } from '@server/db/entities/Topic';
import { DbGroup } from '@server/db/entities/Group';
import { traverseInclude } from '@server/bitran/elements/include';
import { createBitranTranspiler } from '@server/bitran/transpiler';

import type { StringBitranContent } from '@shared/bitran/stringContent';

import { logger } from '@server/logger';

interface RawBitranContent {
    context: BitranContext;
    biCode: string;
}

export async function getBitranContent(
    location: BitranLocation,
    generatePrerenderData: boolean = true,
): Promise<StringBitranContent> {
    const rawContent = await getRawBitranContent(location);
    const bitranContent = await createBitranContent(
        rawContent.context,
        rawContent.biCode,
        generatePrerenderData,
    );
    return bitranContent;
}

export async function getRawBitranContent(
    location: BitranLocation,
): Promise<RawBitranContent> {
    const throwNotFound = () => {
        throw createError({
            statusCode: 404,
            statusText: `Can't find content for location "${stringifyBitranLocation(location)}"!`,
        });
    };

    if (location.unique) {
        const dbUnique = await ERUDIT_SERVER.DB.manager.findOne(DbUnique, {
            where: { location: stringifyBitranLocation(location) },
        });

        if (!dbUnique) throwNotFound();

        return {
            biCode: dbUnique!.content,
            context: dbUnique!.context,
        };
    }

    if (isTopicPart(location.type)) {
        const topicPart = location.type as TopicPart;

        const dbTopic = await ERUDIT_SERVER.DB.manager.findOne(DbTopic, {
            select: ['contentId', topicPart],
            where: { contentId: location.path },
        });

        if (!dbTopic) throwNotFound();

        return {
            biCode: dbTopic![topicPart]!,
            context: { location, aliases: NO_ALIASES() },
        };
    }

    if (location.type === 'group') {
        const dbGroup = await ERUDIT_SERVER.DB.manager.findOne(DbGroup, {
            select: ['contentId', 'content'],
            where: { contentId: location.path },
        });

        if (!dbGroup) throwNotFound();

        return {
            biCode: dbGroup!.content!,
            context: { location, aliases: NO_ALIASES() },
        };
    }

    return throwNotFound();
}

async function createBitranContent(
    context: BitranContext,
    biCode: string,
    generatePrerenderData: boolean = true,
): Promise<StringBitranContent> {
    const bitranTranspiler = await createBitranTranspiler();

    const runtime: EruditBitranRuntime = {
        eruditConfig: ERUDIT_SERVER.CONFIG,
        context,
        insideInclude: false,
    };

    [bitranTranspiler.parser, bitranTranspiler.stringifier].forEach((item) =>
        setEruditBitranRuntime(item, runtime),
    );

    const root = await bitranTranspiler.parser.parse(biCode, {
        async step(node) {
            if (node instanceof AliasesNode) {
                mergeAliases(context.aliases, node.parseData);
                return;
            }

            if (node instanceof IncludeNode) {
                await resolveInclude(node, context);
                return;
            }

            if (
                node instanceof BlockErrorNode ||
                node instanceof InlinerErrorNode
            ) {
                logParseError(node.name, node.error);
                return;
            }
        },
    });

    const finalContent = await bitranTranspiler.stringifier.stringify(root);

    // Building render data
    const preRenderDataMap: Record<string, PreRenderData> = {};

    if (generatePrerenderData) {
        await bitranTranspiler.parser.parse(finalContent, {
            step: async (node) => {
                const id = node.autoId;
                const elementTranspiler =
                    bitranTranspiler.transpilers[node.name]!;

                if (id) {
                    const preRenderData = await createPreRenderData(
                        node,
                        elementTranspiler,
                        runtime,
                    );
                    if (preRenderData) preRenderDataMap[id] = preRenderData;
                }

                if (
                    node instanceof BlockErrorNode ||
                    node instanceof InlinerErrorNode
                ) {
                    logParseError(node.name, node.error);
                    return;
                }
            },
        });
    }

    return {
        biCode: finalContent,
        preRenderData: preRenderDataMap,
    };
}

async function resolveInclude(
    includeNode: IncludeNode,
    context: BitranContext,
): Promise<IncludeNode> {
    let _blocks;

    try {
        const blocks: BlockNode[] = [];

        await traverseInclude(includeNode, context, {
            step: async ({ _node }) => {
                if (_node instanceof BlockNode) blocks.push(_node);
            },
        });

        const blocksNode = new BlocksNode(includeNode);
        blocksNode.setNodes(blocks);
        _blocks = blocksNode;
        includeNode.parseData.blocks = _blocks;
    } catch (error: any) {
        includeNode.parseData.error = error?.message || error;
    }

    includeNode.parseData.resolved = true;
    return includeNode;
}

function logParseError(nodeName: string, error: string) {
    logger.warn(`Error parsing "${nodeName}" element!\n\n${error}`);
}
