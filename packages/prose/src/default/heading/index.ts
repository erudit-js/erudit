import { ProseError } from '../../error';
import { PropsMode } from '../../props';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { isTextElement } from '../text';

export const headingName = 'heading';

export type HeadingSchema = ElementSchema<
    ElementType.Block,
    typeof headingName,
    { level: 1 | 2 | 3; title: string },
    undefined,
    undefined
>;

export const H1 = createHeadingTag('h1', 1);
export const H2 = createHeadingTag('h2', 2);
export const H3 = createHeadingTag('h3', 3);

function createHeadingTag(tagName: string, level: 1 | 2 | 3) {
    return defineTag(
        tagName,
        PropsMode.Mixed,
    )<HeadingSchema, { children: string }>({
        type: ElementType.Block,
        name: headingName,
        dataChildren({ tagName, children }) {
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

            if (!child.data) {
                throw new ProseError(`<${tagName}> element cannot be empty!`);
            }

            return {
                data: { level, title: child.data },
                children: undefined,
            };
        },
    });
}
