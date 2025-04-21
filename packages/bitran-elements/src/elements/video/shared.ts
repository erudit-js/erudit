import {
    BlockNode,
    type DefineElementSchema,
    type RenderDataGenerator,
} from '@bitran-js/core';
import { getCaptionChildren, type Caption } from '../../shared/figure/caption';

export const videoName = 'video';

export interface VideoParseData {
    src: string;
    autoplay: { explicit: boolean; value: boolean };
    invert?: 'light' | 'dark';
    maxWidth?: string;
    caption?: Caption;
}

export interface VideoRenderData {
    resolvedSrc: string;
}

export type VideoSchema = DefineElementSchema<{
    ParseData: VideoParseData;
    RenderData: VideoRenderData;
}>;

export class VideoNode extends BlockNode<VideoSchema> {
    override get children() {
        return getCaptionChildren(this.parseData.caption);
    }
}

export const videoRenderDataGenerator: RenderDataGenerator<VideoSchema> = {
    createKey({ node }) {
        return `${videoName}:${node.parseData.src}`;
    },
};
