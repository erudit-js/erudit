import {
    type RawChildren,
    ensureHasChildren,
    ensureInlinerChild,
} from '../../children';
import type { JsxElement } from '../../element';
import { defineGlobalElement } from '../../globalElement';
import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const captionSecondaryName = 'captionSecondary';

export type CaptionSecondarySchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof captionSecondaryName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: InlinerSchemaAny[];
}>;

export const CaptionSecondary = defineTag('CaptionSecondary')<
    CaptionSecondarySchema,
    { children: RawChildren }
>({
    type: ElementType.Inliner,
    name: captionSecondaryName,
    linkable: false,
    initElement({ element, tagName, children }) {
        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<InlinerSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureInlinerChild(tagName, child);
    },
});

export default defineGlobalElement<CaptionSecondarySchema>()({
    name: captionSecondaryName,
    tags: { CaptionSecondary },
});
