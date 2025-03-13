import {
    BlockNode,
    type BlocksNode,
    type DefineElementSchema,
} from '@bitran-js/core';

export const detailsName = 'details';

export type DetailsSchema = DefineElementSchema<{
    Meta: { title?: string };
    ParseData: BlocksNode;
}>;

export class DetailsNode extends BlockNode<DetailsSchema> {
    override get children() {
        return this.parseData ? [this.parseData] : undefined;
    }
}
