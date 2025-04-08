import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    type PlainObject,
} from '@bitran-js/transpiler';

import { videoName, type VideoParseData, type VideoSchema } from './shared';
import {
    validateRawCaption,
    parseRawCaption,
    toRawCaptionObj,
} from '../../figure/caption';

export class VideoParser extends ObjBlockParseFactory<VideoSchema> {
    override objName = videoName;

    override async parseDataFromObj(obj: PlainObject): Promise<VideoParseData> {
        const { src, caption, invert, maxWidth, autoplay } = obj;

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

        const explicitAutoplay = typeof autoplay !== 'undefined';

        return {
            src,
            invert,
            maxWidth,
            autoplay: {
                explicit: explicitAutoplay,
                value: explicitAutoplay ? Boolean(autoplay) : true,
            },
            caption: caption
                ? await parseRawCaption(caption, this.payload().node, this)
                : undefined,
        };
    }
}

export class VideoStringifier extends ObjStringifyFactory<VideoSchema> {
    override objName = videoName;

    override async createStrData(): Promise<PlainObject> {
        const { src, invert, caption, maxWidth, autoplay } =
            this.payload().parseData;

        const plainObject: PlainObject = {
            src,
        };

        if (autoplay.explicit) {
            plainObject.autoplay = autoplay.value;
        }

        if (invert) {
            plainObject.invert = invert;
        }

        if (maxWidth) {
            plainObject.maxWidth = maxWidth;
        }

        if (caption) {
            Object.assign(
                plainObject,
                await toRawCaptionObj(caption, this.stringifier),
            );
        }

        return plainObject;
    }
}
