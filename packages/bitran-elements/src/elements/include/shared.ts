import {
    BlockNode,
    type BlocksNode,
    type DefineElementSchema,
} from '@bitran-js/core';

export const includeName = 'include';

export interface IncludeParseData {
    location: string;
    resolved?: boolean;
    blocks?: BlocksNode;
    error?: string;
}

export type IncludeSchema = DefineElementSchema<{
    ParseData: IncludeParseData;
}>;

export class IncludeNode extends BlockNode<IncludeSchema> {
    override get children() {
        const children = this.parseData.blocks?.children ?? [];
        return children.length > 0 ? children : undefined;
    }
}
