import type { ProseElementAny } from './element';
import { isTag } from './tag';
import { ProseError } from './error';
import {
    Blocks,
    Br,
    Heading,
    Inliners,
    Link,
    Paragraph,
    Span,
    type BlocksProps,
    type BrProps,
    type HeadingProps,
    type InlinersProps,
    type LinkProps,
    type ParagraphProps,
    type SpanProps,
} from './default';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Default blocks
            blocks: BlocksProps;
            p: ParagraphProps;
            h1: HeadingProps;
            h2: HeadingProps;
            h3: HeadingProps;
            // Default inliners
            inliners: InlinersProps;
            span: SpanProps;
            br: BrProps;
            a: LinkProps;
        }
        type Element = ProseElementAny;
    }
}

export function jsx(type: any, props: any) {
    switch (type) {
        // Default blocks
        case 'blocks':
            return Blocks(props);
        case 'p':
            return Paragraph(props);
        case 'h1':
        case 'h2':
        case 'h3':
            return Heading({ ...props, level: +type.at(-1) });
        // Default inliners
        case 'inliners':
            return Inliners(props);
        case 'span':
            return Span(props);
        case 'br':
            return Br(props);
        case 'a':
            return Link(props);
    }

    if (isTag(type)) {
        return type(props);
    }

    throw new ProseError(`Unknown Erudit JSX tag: "${type}"!`);
}

export const jsxs = jsx;
export const jsxDEV = jsx;
