import { defineAccentTranspiler } from '@erudit-js/bitran-elements/accent/transpiler';

import { statementName } from './shared';

export const statementTranspiler = defineAccentTranspiler({
    objName: statementName,
});
