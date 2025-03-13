import {
    BlockNode,
    type BlocksNode,
    type DefineElementSchema,
} from '@bitran-js/core';

export const detailsName = 'details';

export type DeatilsSchema = DefineElementSchema<{
    ParseData: BlocksNode;
}>;

export class DetailsNode extends BlockNode<DeatilsSchema> {}
