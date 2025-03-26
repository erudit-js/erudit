import {
    blockMathName,
    inlineMathName,
} from '@erudit-js/bitran-elements/math/shared';
import {
    blockMathRenderer,
    inlineMathRenderer,
} from '@erudit-js/bitran-elements/math/renderer';
import { importantName } from '@erudit-js/bitran-elements/accent/default/important/shared';
import { importantRenderer } from '@erudit-js/bitran-elements/accent/default/important/renderer';
import { exampleName } from '@erudit-js/bitran-elements/accent/default/example/shared';
import { exampleRenderer } from '@erudit-js/bitran-elements/accent/default/example/renderer';
import { statementName } from './elements/statement/shared';
import { statementRenderer } from './elements/statement/renderer';
import { termName } from './elements/term/shared';
import { termRenderer } from './elements/term/renderer';

export default defineBitranRenderers({
    [blockMathName]: blockMathRenderer,
    [inlineMathName]: inlineMathRenderer,
    [importantName]: importantRenderer,
    [exampleName]: exampleRenderer,
    [statementName]: statementRenderer,
    [termName]: termRenderer,
});
