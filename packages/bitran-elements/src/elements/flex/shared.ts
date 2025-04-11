import {
    BlockNode,
    type BlocksNode,
    type DefineElementSchema,
} from '@bitran-js/core';

export const flexName = 'flex';

export interface FlexParseData {
    blocks: BlocksNode;
    gap?: string;
    arrange?: string;
}

export type FlexSchema = DefineElementSchema<{
    ParseData: FlexParseData;
}>;

export class FlexNode extends BlockNode<FlexSchema> {
    override get children() {
        return [this.parseData.blocks];
    }
}
