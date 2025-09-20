import type { JsxElement } from './element';
import { Blocks } from './default/blocks';
import { Br } from './default/br';
import { H1, H2, H3 } from './default/heading';
import { Inliners } from './default/inliners';
import { Paragraph } from './default/paragraph';
import { Span } from './default/span';
import { Link } from './default/link';
import { ElementTagSymbol } from './tag';
import type { ElementSchemaAny } from './schema';

declare global {
    namespace JSX {
        interface IntrinsicElements {
            // Default blocks
            blocks: Parameters<typeof Blocks>[0];
            p: Parameters<typeof Paragraph>[0];
            h1: Parameters<typeof H1>[0];
            h2: Parameters<typeof H2>[0];
            h3: Parameters<typeof H3>[0];
            // Default inliners
            inliners: Parameters<typeof Inliners>[0];
            span: Parameters<typeof Span>[0];
            br: Parameters<typeof Br>[0];
            a: Parameters<typeof Link>[0];
        }
        type Element = JsxElement<ElementSchemaAny>;
    }
}

export function jsx(tag: any, props: any) {
    switch (tag) {
        // Default blocks
        case 'blocks':
            return Blocks(props);
        case 'p':
            return Paragraph(props);
        case 'h1':
            return H1(props);
        case 'h2':
            return H2(props);
        case 'h3':
            return H3(props);
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

    if (ElementTagSymbol in tag) {
        return tag(props);
    }

    throw new Error(
        `Provided Erudit JSX tag is missing symbol "ElementTagSymbol"!
Make sure your tag was created with "factory.defineTag()" function from @erudit-js/prose package.
If it was, ensure your tag was created within same JavaScript context as @erudit-js/prose package!
Some bundlers can inline "factory.defineTag()" including inlining symbol creation, which makes it incompatible with JSX environment that uses @erudit-js/prose package.

Tag type: ${typeof tag}
Tag .toString():

${tag}`,
    );
}

export const jsxs = jsx;
export const jsxDEV = jsx;
