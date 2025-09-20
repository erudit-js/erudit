import type { RawChildren } from '../children';
import { isBlockElement, type JsxElement } from '../element';
import { ProseError } from '../error';
import { PropsMode } from '../props';
import type { ElementSchema } from '../schema';
import { defineTag } from '../tag';
import { ElementType } from '../type';

export const inlinersName = 'inliners';

export type InlinersSchema = ElementSchema<
    ElementType.Inliner,
    typeof inlinersName,
    undefined,
    undefined,
    InlinersSchema[]
>;

export const Inliners = defineTag(
    inlinersName,
    PropsMode.Custom,
)<InlinersSchema, { children: RawChildren }>({
    type: ElementType.Inliner,
    name: inlinersName,
    dataChildren({ tagName, children }) {
        if (!children) {
            throw new ProseError(
                `<${tagName}> requires at least one child element!`,
            );
        }

        return {
            data: undefined,
            children: children as JsxElement<InlinersSchema>[],
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
