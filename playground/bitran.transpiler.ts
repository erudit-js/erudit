import {
    blockMathName,
    inlineMathName,
} from '@erudit-js/bitran-elements/math/shared';
import {
    blockMathTranspiler,
    inlineMathTranspiler,
} from '@erudit-js/bitran-elements/math/transpiler';
import { importantName } from '@erudit-js/bitran-elements/accent/default/important/shared';
import { importantTranspiler } from '@erudit-js/bitran-elements/accent/default/important/transpiler';
import { exampleName } from '@erudit-js/bitran-elements/accent/default/example/shared';
import { exampleTranspiler } from '@erudit-js/bitran-elements/accent/default/example/transpiler';
import { statementName } from './elements/statement/shared';
import { statementTranspiler } from './elements/statement/transpiler';
import { termName } from './elements/term/shared';
import { termTranspiler } from './elements/term/transpiler';

export default defineBitranTranspilers({
    [blockMathName]: blockMathTranspiler,
    [inlineMathName]: inlineMathTranspiler,
    [importantName]: importantTranspiler,
    [exampleName]: exampleTranspiler,
    [statementName]: statementTranspiler,
    [termName]: termTranspiler,
});
