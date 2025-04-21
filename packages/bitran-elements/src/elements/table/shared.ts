import {
    BlockNode,
    type DefineElementSchema,
    type InlinersNode,
} from '@bitran-js/core';

import { getCaptionChildren, type Caption } from '../../shared/figure/caption';

export const tableName = 'table';

export interface TableParseData {
    cells: InlinersNode[][];
    maxWidth?: string;
    caption?: Caption;
}

export type TableSchema = DefineElementSchema<{
    ParseData: TableParseData;
}>;

export class TableNode extends BlockNode<TableSchema> {
    override get children() {
        const children = this.parseData.cells.flat();

        if (this.parseData.caption) {
            children.push(...getCaptionChildren(this.parseData.caption)!);
        }

        return children;
    }
}
