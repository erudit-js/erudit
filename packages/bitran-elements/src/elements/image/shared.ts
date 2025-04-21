import {
    BlockNode,
    type DefineElementSchema,
    type RenderDataGenerator,
} from '@bitran-js/core';

import { getCaptionChildren, type Caption } from '../../shared/figure/caption';

export const imageName = 'image';

export interface ImageParseData {
    src: string;
    invert?: 'light' | 'dark';
    maxWidth?: string;
    caption?: Caption;
}

export interface ImageRenderData {
    resolvedSrc: string;
    size: {
        width: number;
        height: number;
    };
}

export type ImageSchema = DefineElementSchema<{
    ParseData: ImageParseData;
    RenderData: ImageRenderData;
}>;

export class ImageNode extends BlockNode<ImageSchema> {
    override get children() {
        return getCaptionChildren(this.parseData.caption);
    }
}

export const imageRenderDataKey = (src: string) => {
    return `${imageName}:${src}`;
};

export const imageRenderDataGenerator: RenderDataGenerator<ImageSchema> = {
    createKey({ node }) {
        return imageRenderDataKey(node.parseData.src);
    },
};
