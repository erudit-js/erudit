import { defineElementTranspiler } from '@bitran-js/transpiler';

import { ImageNode } from './shared';
import { ImageParser, ImageStringifier } from './factory';

export const imageTranspiler = defineElementTranspiler({
    Node: ImageNode,
    Parsers: [ImageParser],
    Stringifier: ImageStringifier,
});
