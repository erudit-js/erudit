import { BlockNode, type DefineElementSchema } from '@bitran-js/core';

import type { Caption } from '../../figure/caption';

export const imageName = 'image';

export interface ImageParseData {
    src: string;
    invert?: 'light' | 'dark';
    caption?: Caption;
    maxWidth?: string;
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
        if (!this.parseData.caption) {
            return undefined;
        }

        const children = [this.parseData.caption.main];

        if (this.parseData.caption.secondary) {
            children.push(this.parseData.caption.secondary);
        }

        return children;
    }
}
