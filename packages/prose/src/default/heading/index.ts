import type { JsxSnippet } from '../../snippet';
import { ProseError } from '../../error';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { isTextElement } from '../text';

export const headingName = 'heading';

export type HeadingSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof headingName;
    Linkable: true;
    Data: { level: 1 | 2 | 3; title: string };
    Storage: undefined;
    Children: undefined;
}>;

export const H1 = createHeadingTag('h1', 1);
export const H2 = createHeadingTag('h2', 2);
export const H3 = createHeadingTag('h3', 3);

function createHeadingTag(tagName: string, level: 1 | 2 | 3) {
    return defineTag(tagName)<HeadingSchema, { children: string }>({
        type: ElementType.Block,
        name: headingName,
        linkable: true,
        initElement({ tagName, element, props, children }) {
            if (!children) {
                throw new ProseError(
                    `<${tagName}> requires exactly one text child element!`,
                );
            }

            if (children.length !== 1) {
                throw new ProseError(
                    `<${tagName}> requires exactly one text child element, but received ${children.length} children: ${children
                        .map((c) => `<${c.tagName}>`)
                        .join(', ')}!`,
                );
            }

            const child = children[0];

            if (!isTextElement(child)) {
                throw new ProseError(
                    `<${tagName}> requires exactly one text child element, but received <${children[0].tagName}>!`,
                );
            }

            const title = child.data.trim();

            if (!title) {
                throw new ProseError(`<${tagName}> element cannot be empty!`);
            }

            element.data = { level, title };

            element.snippet = {
                search: true,
                title: props.$snippet?.title || title,
            } as JsxSnippet;
        },
    });
}
