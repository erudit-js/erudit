import { ensureHasChildren, type RawChildren } from '../../children';
import { isTextElement } from '../../default/text';
import { isElement } from '../../element';
import { ProseError } from '../../error';
import { defineGlobalElement } from '../../globalElement';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { Caption, type CaptionSchema } from '../caption/caption.global';

export const diagramName = 'diagram';

export type DiagramSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof diagramName;
    Linkable: true;
    Data: string;
    Storage: undefined;
    Children: [CaptionSchema] | undefined;
}>;

export const Diagram = defineTag('Diagram')<
    DiagramSchema,
    { children: RawChildren }
>({
    type: ElementType.Block,
    name: diagramName,
    linkable: true,
    initElement({ tagName, element, children }) {
        ensureHasChildren(tagName, children);

        const textChild = children.shift();

        if (!isTextElement(textChild)) {
            throw new ProseError(
                `<${tagName}> first child must be a text element.`,
            );
        }

        element.data = textChild.data;

        if (children.length > 0) {
            const captionChild = children[0];

            if (!isElement(captionChild, Caption)) {
                throw new ProseError(
                    `<${tagName}> second child must be a <Caption> element.`,
                );
            }

            element.children = [captionChild];
        }
    },
});

export default defineGlobalElement<DiagramSchema>()({
    name: diagramName,
    tags: { Diagram },
    dependencies: {
        mermaid: {
            transpile: true,
            optimize: true,
        },
        katex: {
            transpile: true,
            optimize: true,
        },
    },
});
