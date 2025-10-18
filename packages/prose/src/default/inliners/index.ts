import type { RawChildren } from '../../children';
import { isBlockElement, type JsxElement } from '../../element';
import { ProseError } from '../../error';
import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const inlinersName = 'inliners';

export type InlinersSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof inlinersName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: InlinerSchemaAny[];
}>;

export const Inliners = defineTag(inlinersName)<
    InlinersSchema,
    { children: RawChildren }
>({
    type: ElementType.Inliner,
    name: inlinersName,
    linkable: false,
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
