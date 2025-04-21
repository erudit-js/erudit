import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    type PlainObject,
} from '@bitran-js/transpiler';

import type { GalleryParseData, GallerySchema } from './shared';
import type { ImageParseData } from '../image/shared';
import { parseImageData, stringifyImageData } from '../image/factory';

export class GalleryParser extends ObjBlockParseFactory<GallerySchema> {
    override objName = 'gallery';

    override async parseDataFromObj(
        obj: PlainObject,
    ): Promise<GalleryParseData> {
        const { images } = obj;

        if (!images || !Array.isArray(images)) {
            throw new Error('Gallery must have an "images" array property!');
        }

        if (images.length === 0) {
            throw new Error('Gallery must have at least one image!');
        }

        const parsedImages: ImageParseData[] = [];
        for (const image of images) {
            parsedImages.push(
                await parseImageData(image, this.payload().node, this),
            );
        }

        return { images: parsedImages };
    }
}

export class GalleryStringifier extends ObjStringifyFactory<GallerySchema> {
    override objName = 'gallery';

    override async createStrData(): Promise<PlainObject> {
        const { images } = this.payload().parseData;

        const PlainObject: PlainObject = {
            images: [],
        };

        for (const image of images) {
            PlainObject.images.push(
                await stringifyImageData(image, this.stringifier),
            );
        }

        return PlainObject;
    }
}
