import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    type RawObject,
} from '@bitran-js/transpiler';

import {
    calloutName,
    defaultCalloutTypes,
    type CalloutIcon,
    type CalloutParseData,
    type CalloutSchema,
} from './shared';

export class CalloutParser extends ObjBlockParseFactory<CalloutSchema> {
    override objName = calloutName;

    override async parseDataFromObj(obj: RawObject): Promise<CalloutParseData> {
        if (!obj.content || typeof obj.content !== 'string')
            throw new Error('Callout must have a string "content" property!');

        if (!obj.title || typeof obj.title !== 'string')
            throw new Error('Callout must have a string "title" property!');

        return {
            icon: this.parseIcon(obj),
            title: obj.title,
            content: await this.parseBlocks(obj.content),
        };
    }

    parseIcon(obj: RawObject): CalloutIcon {
        const rawIcon = obj.icon;
        if (!rawIcon) throw new Error('Callout must have an "icon" property!');

        if (defaultCalloutTypes.includes(rawIcon))
            return {
                type: 'default',
                calloutType: rawIcon,
            };

        if (typeof rawIcon === 'string')
            return {
                type: 'custom',
                src: rawIcon,
            };

        if (typeof rawIcon === 'object') {
            const { src, invert } = rawIcon;

            if (!src)
                throw new Error(
                    'Callout icon object must have a "src" property!',
                );

            if (invert && !['light', 'dark'].includes(invert))
                throw new Error(
                    'Invalid callout icon "invert" value! Must be "light" or "dark".',
                );

            return {
                type: 'custom',
                src,
                invert,
            };
        }

        throw new Error('Invalid callout icon value!');
    }
}

export class CalloutStringifier extends ObjStringifyFactory<CalloutSchema> {
    override objName = calloutName;

    override async createRawObject(): Promise<RawObject> {
        const { icon, title, content } = this.payload().parseData;

        const obj: RawObject = {};
        obj.title = title;
        obj.icon = this.stringifyIcon(icon);
        obj.content = await this.stringify(content);

        return obj;
    }

    stringifyIcon(icon: CalloutIcon) {
        if (icon.type === 'default') return icon.calloutType;

        if (icon.invert) {
            return {
                src: icon.src,
                invert: icon.invert,
            };
        } else return icon.src;
    }
}
