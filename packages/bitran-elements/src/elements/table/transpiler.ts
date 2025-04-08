import { defineElementTranspiler } from '@bitran-js/transpiler';

import { TableNode, type TableSchema } from './shared';
import { TableParser, TableStringifier } from './factory';

export const tableTranspiler = defineElementTranspiler<TableSchema>({
    Node: TableNode,
    Parsers: [TableParser],
    Stringifier: TableStringifier,
});
