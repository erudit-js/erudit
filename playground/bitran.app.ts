import {
    blockMathName,
    inlineMathName,
} from '@erudit-js/bitran-elements/math/shared';
import {
    blockMathRenderer,
    inlineMathRenderer,
} from '@erudit-js/bitran-elements/math/renderer';
import {
    blockMathTranspiler,
    inlineMathTranspiler,
} from '@erudit-js/bitran-elements/math/transpiler';
import { importantName } from '@erudit-js/bitran-elements/accent/default/important/shared';
import { importantTranspiler } from '@erudit-js/bitran-elements/accent/default/important/transpiler';
import { importantRenderer } from '@erudit-js/bitran-elements/accent/default/important/renderer';
import { exampleName } from '@erudit-js/bitran-elements/accent/default/example/shared';
import { exampleTranspiler } from '@erudit-js/bitran-elements/accent/default/example/transpiler';
import { exampleRenderer } from '@erudit-js/bitran-elements/accent/default/example/renderer';
import { statementName } from './elements/statement/shared';
import { statementTranspiler } from './elements/statement/transpiler';
import { statementRenderer } from './elements/statement/renderer';
import { termName } from './elements/term/shared';
import { termTranspiler } from './elements/term/transpiler';
import { termRenderer } from './elements/term/renderer';
import { calloutName } from '@erudit-js/bitran-elements/callout/shared';
import { calloutTranspiler } from '@erudit-js/bitran-elements/callout/transpiler';
import { calloutRenderer } from '@erudit-js/bitran-elements/callout/renderer';

export default defineAppBitran(async () => {
    return {
        [blockMathName]: {
            transpiler: blockMathTranspiler,
            renderer: blockMathRenderer,
        },
        [inlineMathName]: {
            transpiler: inlineMathTranspiler,
            renderer: inlineMathRenderer,
        },
        [importantName]: {
            transpiler: importantTranspiler,
            renderer: importantRenderer,
        },
        [exampleName]: {
            transpiler: exampleTranspiler,
            renderer: exampleRenderer,
        },
        [statementName]: {
            transpiler: statementTranspiler,
            renderer: statementRenderer,
        },
        [termName]: {
            transpiler: termTranspiler,
            renderer: termRenderer,
        },
        [calloutName]: {
            transpiler: calloutTranspiler,
            renderer: calloutRenderer,
        },
    };
});
