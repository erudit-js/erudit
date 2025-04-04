import { InlinerNode, type DefineElementSchema } from '@bitran-js/core';

import type { LinkTarget } from './target';

export const linkName = 'link';

export interface LinkParseData {
    label: string;
    target: string;
}

export type LinkSchema = DefineElementSchema<{
    ParseData: LinkParseData;
    RenderData: LinkTarget;
}>;

export class LinkNode extends InlinerNode<LinkSchema> {}
