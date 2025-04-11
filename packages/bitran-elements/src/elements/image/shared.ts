import { BlockNode, type DefineElementSchema } from '@bitran-js/core';

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
