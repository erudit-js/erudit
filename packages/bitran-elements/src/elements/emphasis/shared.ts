import {
    InlinerNode,
    type DefineElementSchema,
    type InlinersNode,
} from '@bitran-js/core';

export const emphasisName = 'emphasis';

export interface EmphasisParseData {
    type: 'bold' | 'italic';
    inliners: InlinersNode;
}

export type EmphasisSchema = DefineElementSchema<{
    ParseData: EmphasisParseData;
}>;

export class EmphasisNode extends InlinerNode<EmphasisSchema> {
    override get children() {
        return this.parseData ? [this.parseData.inliners] : undefined;
    }
}
