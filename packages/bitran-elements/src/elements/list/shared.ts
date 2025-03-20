import {
    BlockNode,
    type BlocksNode,
    type DefineElementSchema,
} from '@bitran-js/core';

export const listName = 'list';

export type ListType = 'ol' | 'ul';

export interface ListBaseParseData {
    isObj: boolean;
    type: ListType;
    items: BlocksNode[];
}

export interface ListOrderedParseData extends ListBaseParseData {
    type: 'ol';
    start: number;
}

export interface ListUnorderedParseData extends ListBaseParseData {
    type: 'ul';
}

export type ListParseData = ListOrderedParseData | ListUnorderedParseData;

export type ListSchema = DefineElementSchema<{
    ParseData: ListParseData;
}>;

export class ListNode extends BlockNode<ListSchema> {
    override get children() {
        return this.parseData.items;
    }
}
