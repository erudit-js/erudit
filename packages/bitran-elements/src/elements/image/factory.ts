import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    type RawObject,
} from '@bitran-js/transpiler';

import { imageName, type ImageParseData, type ImageSchema } from './shared';
import {
    parseRawCaption,
    toRawCaption,
    validateRawCaption,
} from '../../figure/caption';

export class ImageParser extends ObjBlockParseFactory<ImageSchema> {
    override objName = imageName;

    override async parseDataFromObj(obj: RawObject): Promise<ImageParseData> {
        const { src, caption, invert, maxWidth } = obj;

        if (!src || typeof src !== 'string') {
            throw new Error('Image must have a string "src" property!');
        }

        if (invert && !['light', 'dark'].includes(invert)) {
            throw new Error(
                'Invalid image "invert" value! Must be "light" or "dark".',
            );
        }

        if (caption) {
            validateRawCaption(caption);
        }

        const { node } = this.payload();

        return {
            src,
            invert,
            maxWidth,
            caption: caption
                ? await parseRawCaption(caption, node, this)
                : undefined,
        };
    }
}

export class ImageStringifier extends ObjStringifyFactory<ImageSchema> {
    override objName = imageName;

    override async createRawObject(): Promise<RawObject> {
        const { src, invert, caption, maxWidth } = this.payload().parseData;

        const rawObject: RawObject = {
            src,
        };

        if (invert) {
            rawObject.invert = invert;
        }

        if (maxWidth) {
            rawObject.maxWidth = maxWidth;
        }

        if (caption) {
            rawObject.caption = await toRawCaption(caption, this.stringifier);
        }

        return rawObject;
    }
}
