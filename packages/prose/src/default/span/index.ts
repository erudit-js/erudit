import { isBlockElement, type JsxElement } from '../../element';
import { ProseError } from '../../error';
import type { ElementSchema, InlinerSchemaAny } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const spanName = 'span';

export type SpanSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof spanName;
    Linkable: true;
    Data: undefined;
    Storage: undefined;
    Children: InlinerSchemaAny[];
}>;

export const Span = defineTag(spanName)<SpanSchema>({
    type: ElementType.Inliner,
    name: spanName,
    linkable: true,
    fillElement({ tagName, children }) {
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
