import {
    BlockNode,
    type BlocksNode,
    type DefineElementSchema,
} from '@bitran-js/core';

export const detailsName = 'details';

export type DetailsSchema = DefineElementSchema<{
    ParseData: BlocksNode;
}>;

export class DetailsNode extends BlockNode<DetailsSchema> {}
