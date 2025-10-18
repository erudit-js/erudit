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

export const captionMainName = 'captionMain';

export type CaptionMainSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof captionMainName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: InlinerSchemaAny[];
}>;

export const CaptionMain = defineTag('CaptionMain')<
    CaptionMainSchema,
    { children: RawChildren }
>({
    type: ElementType.Inliner,
    name: captionMainName,
    linkable: false,
    initElement({ element, tagName, children }) {
        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<InlinerSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureInlinerChild(tagName, child);
    },
});

export default defineGlobalElement<CaptionMainSchema>()({
    name: captionMainName,
    tags: { CaptionMain },
});
