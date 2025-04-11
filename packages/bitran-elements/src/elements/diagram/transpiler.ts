import { defineElementTranspiler } from '@bitran-js/transpiler';

import { DiagramNode, type DiagramSchema } from './shared';
import { DiagramParser, DiagramStringifier } from './factory';

export const diagramTranspiler = defineElementTranspiler<DiagramSchema>({
    Node: DiagramNode,
    Parsers: [DiagramParser],
    Stringifier: DiagramStringifier,
});
