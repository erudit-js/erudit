import {
    ensureHasChildren,
    ensureInlinerChild,
    type RawChildren,
} from '../../children';
import { type JsxElement } from '../../element';
import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const paragraphName = 'paragraph';

export type ParagraphSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof paragraphName;
    Linkable: true;
    Data:
        | {
              center?: true;
              serif?: true;
          }
        | undefined;
    Storage: undefined;
    Children: InlinerSchemaAny[];
}>;

export const Paragraph = defineTag('p')<
    ParagraphSchema,
    { children: RawChildren; center?: true; serif?: true }
>({
    type: ElementType.Block,
    name: paragraphName,
    linkable: true,
    initElement({ tagName, element, children, props }) {
        if (props.center || props.serif) {
            element.data = {};
            if (props.center) {
                element.data.center = true;
            }
            if (props.serif) {
                element.data.serif = true;
            }
        }

        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<InlinerSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureInlinerChild(tagName, child);
    },
});
