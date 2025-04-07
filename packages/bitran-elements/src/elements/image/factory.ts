import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    ParseFactory,
    Stringifier,
    type RawObject,
} from '@bitran-js/transpiler';

import { imageName, type ImageParseData, type ImageSchema } from './shared';
import {
    parseRawCaption,
    toRawCaption,
    validateRawCaption,
} from '../../figure/caption';
import type { BlockNode } from '@bitran-js/core';

export async function parseImageData(
    obj: RawObject,
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
): Promise<RawObject> {
    const { src, invert, caption, maxWidth } = parseData;

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
        rawObject.caption = await toRawCaption(caption, stringifier);
    }

    return rawObject;
}

//
//
//

export class ImageParser extends ObjBlockParseFactory<ImageSchema> {
    override objName = imageName;

    override async parseDataFromObj(obj: RawObject): Promise<ImageParseData> {
        return parseImageData(obj, this.payload().node, this);
    }
}

export class ImageStringifier extends ObjStringifyFactory<ImageSchema> {
    override objName = imageName;

    override async createRawObject(): Promise<RawObject> {
        const { parseData } = this.payload();
        return stringifyImageData(parseData, this.stringifier);
    }
}
