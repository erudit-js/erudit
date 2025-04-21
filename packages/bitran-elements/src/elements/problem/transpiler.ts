import { defineElementTranspiler } from '@bitran-js/transpiler';

import {
    ProblemNode,
    ProblemsNode,
    type ProblemsSchema,
    type ProblemSchema,
} from './shared';
import {
    ProblemParser,
    ProblemsParser,
    ProblemsStringifier,
    ProblemStringifier,
} from './factory';

export const problemTranspiler = defineElementTranspiler<ProblemSchema>({
    Node: ProblemNode,
    Parsers: [ProblemParser],
    Stringifier: ProblemStringifier,
});

export const problemsTranspiler = defineElementTranspiler<ProblemsSchema>({
    Node: ProblemsNode,
    Parsers: [ProblemsParser],
    Stringifier: ProblemsStringifier,
});
