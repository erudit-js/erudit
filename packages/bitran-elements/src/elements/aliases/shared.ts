import { BlockNode, type DefineElementSchema } from '@bitran-js/core';
import type { BitranAliases } from '@erudit-js/cog/schema';

export const aliasesName = 'aliases';

export type AliasesSchema = DefineElementSchema<{
    ParseData: BitranAliases;
}>;

export class AliasesNode extends BlockNode<AliasesSchema> {}
