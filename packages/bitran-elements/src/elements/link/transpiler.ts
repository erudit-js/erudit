import { defineElementTranspiler } from '@bitran-js/transpiler';

import { LinkNode, type LinkSchema } from './shared';
import { LinkParser, LinkStringifier } from './factory';

export const linkTranspiler = defineElementTranspiler<LinkSchema>({
    Node: LinkNode,
    Parsers: [LinkParser],
    Stringifier: LinkStringifier,
});
