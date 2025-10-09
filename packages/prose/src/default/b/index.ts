import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { ElementType } from '../../type';
import { defineTag } from '../../tag';
import {
    ensureHasChildren,
    ensureInlinerChild,
    type RawChildren,
} from '../../children';
import type { JsxElement } from '../../element';

export const bName = 'bold';

export type BSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof bName;
    Linkable: false;
    Data: { accent?: true } | undefined;
    Storage: undefined;
    Children: InlinerSchemaAny[];
}>;

export const B = defineTag('b')<
    BSchema,
    { children: RawChildren; accent?: true }
>({
    type: ElementType.Inliner,
    name: bName,
    linkable: false,
    initElement({ element, tagName, props, children }) {
        if (props.accent) {
            element.data = { accent: true };
        }

        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<InlinerSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureInlinerChild(tagName, child);
    },
});
