import {
    BlockNode,
    type DefineElementSchema,
    type RenderDataGenerator,
} from '@bitran-js/core';
import type { BitranLocationType } from '@erudit-js/cog/schema';

export const blockLinkName = 'blockLink';

export interface BlockLinkParseData {
    location: string;
    label?: string;
}

interface BlockLinkBaseRenderData {
    locationType: BitranLocationType;
    link: string;
    title: string;
    locationDescription?: string;
}

export interface BlockLinkUniqueRenderData extends BlockLinkBaseRenderData {
    type: 'unique';
    elementName: string;
    locationTitle: string;
}

export interface BlockLinkLocationRenderData extends BlockLinkBaseRenderData {
    type: 'location';
}

export type BlockLinkRenderData =
    | BlockLinkUniqueRenderData
    | BlockLinkLocationRenderData;

export type BlockLinkSchema = DefineElementSchema<{
    ParseData: BlockLinkParseData;
    RenderData: BlockLinkRenderData;
}>;

export class BlockLinkNode extends BlockNode<BlockLinkSchema> {}

export const blockLinkRenderDataGenerator: RenderDataGenerator<BlockLinkSchema> =
    {
        createKey({ node }) {
            return `${blockLinkName}:${node.parseData.location}`;
        },
    };
