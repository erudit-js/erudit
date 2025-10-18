import {
    ensureHasChildren,
    ensureInlinerChild,
    type RawChildren,
} from '../../children';
import { isElement } from '../../element';
import { ProseError } from '../../error';
import { defineGlobalElement } from '../../globalElement';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { CaptionMain, type CaptionMainSchema } from './main.global';
import {
    CaptionSecondary,
    type CaptionSecondarySchema,
} from './secondary.global';

export const captionName = 'caption';

export interface CaptionData {
    width?: string;
}

export type CaptionSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof captionName;
    Linkable: false;
    Data: CaptionData;
    Storage: undefined;
    Children: [CaptionMainSchema] | [CaptionMainSchema, CaptionSecondarySchema];
}>;

export const Caption = defineTag('Caption')<
    CaptionSchema,
    {
        width?: string;
        children: RawChildren;
    }
>({
    type: ElementType.Block,
    name: captionName,
    linkable: false,
    initElement({ tagName, element, props, children }) {
        element.data = {};

        if (props.width) {
            element.data.width = props.width;
        }

        ensureHasChildren(captionName, children);

        const hasMain = children.some((c) => isElement(c, CaptionMain));
        const hasSecondary = children.some((c) =>
            isElement(c, CaptionSecondary),
        );

        if (hasSecondary && !hasMain) {
            throw new ProseError(
                `<${tagName}> cannot have a <${CaptionSecondary.tagName}> without a <${CaptionMain.tagName}>.`,
            );
        }

        if (hasMain) {
            const [first, second, ...rest] = children;
            if (!first || !isElement(first, CaptionMain)) {
                throw new ProseError(
                    `<${tagName}> requires <${CaptionMain.tagName}> as its first child when used.`,
                );
            }
            if (second) {
                if (!isElement(second, CaptionSecondary)) {
                    throw new ProseError(
                        `<${tagName}> can only have <${CaptionSecondary.tagName}> as its second child.`,
                    );
                }
            }
            if (rest.length > 0) {
                throw new ProseError(
                    `<${tagName}> cannot have more than two children (Main[, Secondary]).`,
                );
            }
            element.children = (second ? [first, second] : [first]) as any;
            return;
        }

        const wrappedMain = CaptionMain({ children: children as any });
        element.children = [wrappedMain] as any;
    },
    childStep({ tagName, child }) {
        ensureInlinerChild(tagName, child);
    },
});

export default defineGlobalElement<CaptionSchema>()({
    name: captionName,
    tags: { Caption },
});
