import {
    BlockNode,
    type DefineElementSchema,
    type InlinersNode,
} from '@bitran-js/core';

import type { Caption } from '../../figure/caption';

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
            children.push(this.parseData.caption.main);
            if (this.parseData.caption.secondary) {
                children.push(this.parseData.caption.secondary);
            }
        }

        return children;
    }
}
