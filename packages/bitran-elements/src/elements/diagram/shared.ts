import { BlockNode, type DefineElementSchema } from '@bitran-js/core';

import { getCaptionChildren, type Caption } from '../../shared/figure/caption';

export const diagramName = 'diagram';

export interface DiagramParseData {
    content: string;
    caption?: Caption;
}

export type DiagramSchema = DefineElementSchema<{
    ParseData: DiagramParseData;
}>;

export class DiagramNode extends BlockNode<DiagramSchema> {
    override get children() {
        return getCaptionChildren(this.parseData.caption);
    }
}
