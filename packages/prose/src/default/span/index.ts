import { isBlockElement, type JsxElement } from '../../element';
import { ProseError } from '../../error';
import { PropsMode } from '../../props';
import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const spanName = 'span';

export type SpanSchema = ElementSchema<
    ElementType.Inliner,
    typeof spanName,
    undefined,
    undefined,
    InlinerSchemaAny[]
>;

export const Span = defineTag(
    spanName,
    PropsMode.Default,
)<SpanSchema, never>({
    type: ElementType.Inliner,
    name: spanName,
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
