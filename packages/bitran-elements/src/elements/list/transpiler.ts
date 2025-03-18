import { defineElementTranspiler } from '@bitran-js/transpiler';

import { ListNode, type ListSchema } from './shared';
import { ListInlineParser, ListObjectParser, ListStringifier } from './factory';

export const listTranspiler = defineElementTranspiler<ListSchema>({
    Node: ListNode,
    Parsers: [ListInlineParser, ListObjectParser],
    Stringifier: ListStringifier,
});
