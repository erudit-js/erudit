import {
    ensureBlockChild,
    ensureHasChildren,
    type RawChildren,
} from '../../children';
import type { JsxElement } from '../../element';
import { defineGlobalElement } from '../../globalElement';
import type { BlockSchemaAny, ElementSchema } from '../../schema';
import type { InvertOption } from '../../shared';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const calloutName = 'callout';

export interface CalloutData {
    iconSrc: string;
    title: string;
    iconInvert?: InvertOption;
}

export interface CalloutStorage {
    resolvedSrc: string;
}

export type CalloutSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof calloutName;
    Linkable: true;
    Data: CalloutData;
    Storage: CalloutStorage;
    Children: BlockSchemaAny[];
}>;

export const Callout = defineTag('Callout')<
    CalloutSchema,
    {
        icon: string;
        title: string;
        iconInvert?: InvertOption;
        children: RawChildren;
    }
>({
    type: ElementType.Block,
    name: calloutName,
    linkable: true,
    initElement({ tagName, element, props, children }) {
        element.data = {
            iconSrc: props.icon,
            title: props.title,
        };

        if (props.iconInvert) {
            element.data.iconInvert = props.iconInvert;
        }

        element.storageKey = calloutName + ': ' + element.data.iconSrc;

        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<BlockSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureBlockChild(tagName, child);
    },
});

export default defineGlobalElement<CalloutSchema>()({
    name: calloutName,
    tags: { Callout },
});
