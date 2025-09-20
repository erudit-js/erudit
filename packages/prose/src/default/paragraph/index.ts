import { isBlockElement, type JsxElement } from '../../element';
import { ProseError } from '../../error';
import { PropsMode } from '../../props';
import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const paragraphName = 'paragraph';

export type ParagraphSchema = ElementSchema<
    ElementType.Block,
    typeof paragraphName,
    undefined,
    undefined,
    InlinerSchemaAny[]
>;

export const Paragraph = defineTag(
    'p',
    PropsMode.Default,
)<ParagraphSchema, never>({
    type: ElementType.Block,
    name: paragraphName,
    dataChildren({ tagName, children }) {
        if (!children) {
            throw new ProseError(
                `<${tagName}> requires at least one child element!`,
            );
        }

        return {
            data: undefined,
            children: children as JsxElement<InlinerSchemaAny>[],
        };
    },
    childStep({ tagName, child }) {
        if (isBlockElement(child)) {
            throw new ProseError(
                `<${tagName}> can only have inliner children, but detected block child <${child.tagName}>!`,
            );
        }
    },
});
