import type { RawChildren } from 'src/children';
import { isBlockElement, type JsxElement } from '../../element';
import { ProseError } from '../../error';
import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { defineGlobalElement } from 'src/globalElement';

export const paragraphName = 'paragraph';

export type ParagraphSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof paragraphName;
    Linkable: true;
    Data: undefined;
    Storage: undefined;
    Children: InlinerSchemaAny[];
}>;

export const Paragraph = defineTag('p')<
    ParagraphSchema,
    { children: RawChildren }
>({
    type: ElementType.Block,
    name: paragraphName,
    linkable: true,
    initElement({ tagName, element, children }) {
        if (!children) {
            throw new ProseError(
                `<${tagName}> requires at least one child element!`,
            );
        }

        element.children = children as JsxElement<InlinerSchemaAny>[];
    },
    childStep({ tagName, child }) {
        if (isBlockElement(child)) {
            throw new ProseError(
                `<${tagName}> can only have inliner children, but detected block child <${child.tagName}>!`,
            );
        }
    },
});
