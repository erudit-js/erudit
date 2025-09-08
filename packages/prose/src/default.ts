import {
    isBlock,
    isInliner,
    ProseElementType,
    type ProseBlockAny,
    type ProseElement,
    type ProseElementAny,
    type ProseInlinerAny,
} from './element';
import { ProseError } from './error';
import type { ProseRef } from './ref';
import { defineTag, type ProseGlobalProps } from './tag';

//
// Text
//

export const textName = 'text';

export type ProseText = ProseElement<
    ProseElementType.Inliner,
    typeof textName,
    string
>;

export function isTextElement(element: any): element is ProseText {
    return (
        typeof element === 'object' &&
        element?.type === ProseElementType.Inliner &&
        element?.name === textName
    );
}

//
// Paragraph
//

export const paragraphName = 'paragraph';

export type ProseParagraph = ProseElement<
    ProseElementType.Block,
    typeof paragraphName,
    ProseInlinerAny[]
>;

export type ParagraphProps = ProseGlobalProps<ProseParagraph>;

export const Paragraph = defineTag<ProseParagraph, ParagraphProps>({
    type: ProseElementType.Block,
    name: paragraphName,
    createData({ children }) {
        if (!children) {
            throw new ProseError(`<p> requires at least one child element!`);
        }

        return children as ProseInlinerAny[];
    },
    childStep: (child) => {
        if (isBlock(child)) {
            throw new ProseError(`<p> cannot have block children!`);
        }
    },
});

//
// Br
//

export const brName = 'br';

export type ProseBr = ProseElement<ProseElementType.Inliner, typeof brName>;

export type BrProps = { children: undefined };

export const Br = defineTag<ProseBr, BrProps>({
    type: ProseElementType.Inliner,
    name: brName,
    createData: () => undefined,
    childStep: () => {
        throw new ProseError(`<br> cannot have children!`);
    },
});

//
// Span
//

export const spanName = 'span';

export type ProseSpan = ProseElement<
    ProseElementType.Inliner,
    typeof spanName,
    ProseInlinerAny[]
>;

export type SpanProps = ProseGlobalProps<ProseSpan>;

export const Span = defineTag<ProseSpan, SpanProps>({
    type: ProseElementType.Inliner,
    name: spanName,
    createData({ children }) {
        if (!children) {
            throw new ProseError(`<span> requires at least one child element!`);
        }

        return children as ProseInlinerAny[];
    },
});

//
// Link
//

export const linkName = 'link';

export type ProseLink = ProseElement<
    ProseElementType.Inliner,
    typeof linkName,
    {
        label: string;
        to: string;
        hint?: string;
    }
>;

export type LinkProps = {
    children: string;
    to: ProseRef<ProseElementAny>;
    hint?: string;
};

export const Link = defineTag<ProseLink, LinkProps>({
    type: ProseElementType.Inliner,
    name: linkName,
    createData({ props, children }) {
        if (!children || children.length !== 1) {
            throw new ProseError(`<a> requires one text child element!`);
        }
        const textChild = children[0];

        if (!isTextElement(textChild)) {
            throw new ProseError(`<a> single child must be a text element!`);
        }

        return {
            label: textChild.data,
            to: props.to.url,
            hint: props.hint,
        };
    },
});

//
// Heading
//

export const headingName = 'heading';

export type HeadingLevels = 1 | 2 | 3;

export type ProseHeading = ProseElement<
    ProseElementType.Block,
    typeof headingName,
    {
        level: HeadingLevels;
        title: string;
    }
>;

export type HeadingProps = ProseGlobalProps<ProseHeading> & {
    children: string;
};

export const Heading = defineTag<ProseHeading, HeadingProps>({
    type: ProseElementType.Block,
    name: headingName,
    createData({ props, children }) {
        if (!children || children.length !== 1) {
            throw new ProseError(`<heading> requires one text child element!`);
        }

        const textChild = children[0];

        if (!isTextElement(textChild)) {
            throw new ProseError(
                `<heading> single child must be a text element!`,
            );
        }

        // @ts-expect-error Level is passed automatically, not by specifying in JSX props
        const level = props.level;

        if (![1, 2, 3].includes(level)) {
            throw new ProseError(`<heading> level must be 1, 2, or 3!`);
        }

        return {
            level,
            title: textChild.data,
        };
    },
});

//
// Blocks
//

export const blocksName = 'blocks';

export type ProseBlocks = ProseElement<
    ProseElementType.Block,
    typeof blocksName,
    ProseBlockAny[]
>;

export type BlocksProps = ProseGlobalProps<ProseBlocks>;

export const Blocks = defineTag<ProseBlocks, BlocksProps>({
    type: ProseElementType.Block,
    name: blocksName,
    createData({ children }) {
        if (!children) {
            throw new ProseError(
                `<blocks> requires at least one child element!`,
            );
        }

        return children as ProseBlockAny[];
    },
    childStep: (child) => {
        if (isInliner(child)) {
            throw new ProseError(`<blocks> can only have block children!`);
        }
    },
});

//
// Inliners
//

export const inlinersName = 'inliners';

export type ProseInliners = ProseElement<
    ProseElementType.Inliner,
    typeof inlinersName,
    ProseInlinerAny[]
>;

export type InlinersProps = ProseGlobalProps<ProseInliners>;

export const Inliners = defineTag<ProseInliners, InlinersProps>({
    type: ProseElementType.Inliner,
    name: inlinersName,
    createData({ children }) {
        if (!children) {
            throw new ProseError(
                `<inliners> requires at least one child element!`,
            );
        }

        return children as ProseInlinerAny[];
    },
});
