import { defineElementTranspiler, type RawObject } from '@bitran-js/transpiler';
import {
    type EruditBitranRuntime,
    getEruditBitranRuntime,
} from '@erudit-js/cog/schema';

import { GalleryParser, GalleryStringifier } from './factory';
import {
    GalleryNode,
    type GallerySchema,
    type GalleryParseData,
} from './shared';
import { normalizeImageSrc, getImageRenderData } from '../image/server';

export class GalleryServerParser extends GalleryParser {
    override async parseDataFromObj(obj: RawObject): Promise<GalleryParseData> {
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
    async createPreRenderData(node, runtime: EruditBitranRuntime) {
        if (!runtime)
            throw new Error(
                'Missing runtime when prerendering gallery element!',
            );

        const images = await Promise.all(
            node.parseData.images.map(async (image) => {
                return await getImageRenderData(
                    image.src,
                    runtime.context.location.path!,
                );
            }),
        );

        return { images };
    },
});
