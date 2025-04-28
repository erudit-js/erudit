import { BlockNode, type DefineElementSchema } from '@bitran-js/core';

export const hrName = 'hr';

export type HrSchema = DefineElementSchema<{}>;

export class HrNode extends BlockNode<HrSchema> {}
