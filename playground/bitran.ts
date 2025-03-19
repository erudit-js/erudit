import {
    blockMathName,
    inlineMathName,
} from '@erudit-js/bitran-elements/math/shared';
import {
    blockMathElement,
    inlineMathElement,
} from '@erudit-js/bitran-elements/math/element';
import {
    importantElement,
    importantName,
} from '@erudit-js/bitran-elements/accent/default/important/element';
import {
    exampleElement,
    exampleName,
} from '@erudit-js/bitran-elements/accent/default/example/element';

import { statementElement, statementName } from './elements/statement/element';
import { termElement, termName } from './elements/term/element';

export default defineBitranConfig({
    elements: {
        [blockMathName]: blockMathElement,
        [inlineMathName]: inlineMathElement,
        [importantName]: importantElement,
        [exampleName]: exampleElement,
        [statementName]: statementElement,
        [termName]: termElement,
    },
});
