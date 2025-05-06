import {
    BlockErrorNode,
    BlocksNode,
    createRenderData,
    ElementNode,
    InlinerErrorNode,
    walkDown,
    type RenderDataStorage,
} from '@bitran-js/core';
import {
    isTopicPart,
    mergeAliases,
    NO_ALIASES,
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
import { logger } from '@server/logger';

import type { StringBitranContent } from '@shared/bitran/stringContent';

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
    const runtime: EruditBitranRuntime = {
        eruditConfig: ERUDIT_SERVER.CONFIG,
        insideInclude: false,
        context,
    };

    const bitranTranspiler = await createBitranTranspiler(runtime);

    const renderDataStorage: RenderDataStorage = {};

    async function makePreRender(node: ElementNode) {
        if (generatePrerenderData === false) {
            return;
        }

        const transpiler = bitranTranspiler.transpilers[node.name];
        await createRenderData({
            storage: renderDataStorage,
            node,
            extra: runtime,
            generator: transpiler?.renderDataGenerator,
        });
    }

    const root = await bitranTranspiler.parser.parse(biCode, {
        async step(node) {
            switch (true) {
                case node instanceof AliasesNode:
                    mergeAliases(context.aliases, node.parseData);
                    break;
                case node instanceof IncludeNode:
                    const includeNode = await resolveInclude(node, context);
                    await walkDown(includeNode, async (child) => {
                        if (child instanceof ElementNode) {
                            await makePreRender(child);
                        }
                    });
                    break;
                case node instanceof BlockErrorNode:
                case node instanceof InlinerErrorNode:
                    logParseError(node.name, node.error);
                    return;
            }

            await makePreRender(node);
        },
    });

    const finalContent = await bitranTranspiler.stringifier.stringify(root);

    return {
        biCode: finalContent,
        renderDataStorage,
    };
}

async function resolveInclude(
    includeNode: IncludeNode,
    context: BitranContext,
): Promise<IncludeNode> {
    let _blocks;

    try {
        const blocks = await traverseInclude(includeNode, context, {});
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
