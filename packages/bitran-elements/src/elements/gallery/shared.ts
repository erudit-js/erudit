import { BlockNode, type DefineElementSchema } from '@bitran-js/core';

import type { ImageParseData, ImageRenderData } from '../image/shared';
import { getCaptionChildren, type Caption } from '../../shared/figure/caption';

export const galleryName = 'gallery';

export interface GalleryParseData {
    images: ImageParseData[];
}

export interface GalleryRenderData {
    images: ImageRenderData[];
}

export type GallerySchema = DefineElementSchema<{
    ParseData: GalleryParseData;
    RenderData: GalleryRenderData;
}>;

export class GalleryNode extends BlockNode<GallerySchema> {
    override get children() {
        const captions: Caption[] = this.parseData.images
            .map((image) => image.caption)
            .filter((caption) => !!caption);

        const children = captions
            .map((caption) => getCaptionChildren(caption)!)
            .flat();

        return children.length > 0 ? children : undefined;
    }
}
