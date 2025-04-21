import {
    defineElementTranspiler,
    type PlainObject,
} from '@bitran-js/transpiler';
import { getEruditBitranRuntime } from '@erudit-js/cog/schema';

import { GalleryParser, GalleryStringifier } from './factory';
import {
    GalleryNode,
    type GallerySchema,
    type GalleryParseData,
} from './shared';
import { normalizeImageSrc, getImageRenderData } from '../image/server';
import { imageRenderDataKey } from '../image/shared';

export class GalleryServerParser extends GalleryParser {
    override async parseDataFromObj(
        obj: PlainObject,
    ): Promise<GalleryParseData> {
        const parseData = await super.parseDataFromObj(obj);
        const { insideInclude, context } = getEruditBitranRuntime(this);

        for (const image of parseData.images) {
            image.src = normalizeImageSrc(
                image.src,
                context.location.path!,
                insideInclude,
            );
        }

        return parseData;
    }
}

export const galleryServerTranspiler = defineElementTranspiler<GallerySchema>({
    Node: GalleryNode,
    Parsers: [GalleryServerParser],
    Stringifier: GalleryStringifier,
    renderDataGenerator: {
        async createValue({ storage, node, extra: runtime }) {
            const imageSources = node.parseData.images.map(
                (image) => image.src,
            );

            for (const imageSource of imageSources) {
                const imageKey = imageRenderDataKey(imageSource);
                storage[imageKey] ||= {
                    type: 'success',
                    data: await getImageRenderData(imageSource, runtime),
                };
            }

            return undefined;
        },
    },
});
