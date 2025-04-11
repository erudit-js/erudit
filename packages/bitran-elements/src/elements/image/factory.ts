import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    ParseFactory,
    Stringifier,
    type PlainObject,
} from '@bitran-js/transpiler';

import { imageName, type ImageParseData, type ImageSchema } from './shared';
import {
    parseRawCaption,
    toRawCaptionObj,
    validateRawCaption,
} from '../../shared/figure/caption';
import type { BlockNode } from '@bitran-js/core';

export async function parseImageData(
    obj: PlainObject,
    node: BlockNode,
    parser: ParseFactory,
): Promise<ImageParseData> {
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

    return {
        src,
        invert,
        maxWidth,
        caption: caption
            ? await parseRawCaption(caption, node, parser)
            : undefined,
    };
}

export async function stringifyImageData(
    parseData: ImageParseData,
    stringifier: Stringifier,
): Promise<PlainObject> {
    const { src, invert, caption, maxWidth } = parseData;

    const plainObject: PlainObject = {
        src,
    };

    if (invert) {
        plainObject.invert = invert;
    }

    if (maxWidth) {
        plainObject.maxWidth = maxWidth;
    }

    if (caption) {
        Object.assign(plainObject, await toRawCaptionObj(caption, stringifier));
    }

    return plainObject;
}

//
//
//

export class ImageParser extends ObjBlockParseFactory<ImageSchema> {
    override objName = imageName;

    override async parseDataFromObj(obj: PlainObject): Promise<ImageParseData> {
        return parseImageData(obj, this.payload().node, this);
    }
}

export class ImageStringifier extends ObjStringifyFactory<ImageSchema> {
    override objName = imageName;

    override async createStrData(): Promise<PlainObject> {
        const { parseData } = this.payload();
        return stringifyImageData(parseData, this.stringifier);
    }
}
