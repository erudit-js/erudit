import { BlockNode, type DefineElementSchema } from '@bitran-js/core';

import type { ImageParseData, ImageRenderData } from '../image/shared';
import type { Caption } from '../../figure/caption';

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

        const children = captions.flatMap((caption) => {
            const { main, secondary } = caption;
            const nodes = [main];

            if (secondary) {
                nodes.push(secondary);
            }

            return nodes;
        });

        return children.length > 0 ? children : undefined;
    }
}
