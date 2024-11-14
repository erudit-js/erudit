import { InlinerNode, type DefineElementSchema } from '@bitran-js/core';

import type { LinkTarget } from './target';

export const linkName = 'link';

export interface LinkParseData {
    target: string;
    label: string;
}

export type LinkSchema = DefineElementSchema<{
    ParseData: LinkParseData;
    RenderData: LinkTarget;
}>;

export class LinkNode extends InlinerNode<LinkSchema> {}
