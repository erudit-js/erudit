import {
    ensureBlockChild,
    ensureHasChildren,
    type RawChildren,
} from '../../children';
import type { JsxElement } from '../../element';
import type { BlockSchemaAny, ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const flexName = 'flex';

export interface FlexData {
    gap?: string;
    justifyContent?: string;
}

export type FlexSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof flexName;
    Linkable: true;
    Data: FlexData;
    Storage: undefined;
    Children: BlockSchemaAny[];
}>;

export const Flex = defineTag('flex')<
    FlexSchema,
    { gap?: string; justifyContent?: string; children: RawChildren }
>({
    type: ElementType.Block,
    name: flexName,
    linkable: true,
    initElement({ tagName, element, props, children }) {
        element.data = {
            gap: props.gap,
            justifyContent: props.justifyContent,
        };

        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<BlockSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureBlockChild(tagName, child);
    },
});
