import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { ElementType } from '../../type';
import { defineTag } from '../../tag';
import {
    ensureHasChildren,
    ensureInlinerChild,
    type RawChildren,
} from '../../children';
import type { JsxElement } from '../../element';

export const iName = 'italic';

export type ISchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof iName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: InlinerSchemaAny[];
}>;

export const I = defineTag('i')<ISchema, { children: RawChildren }>({
    type: ElementType.Inliner,
    name: iName,
    linkable: false,
    initElement({ element, tagName, children }) {
        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<InlinerSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureInlinerChild(tagName, child);
    },
});
