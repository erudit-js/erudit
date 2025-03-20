import { InlinerNode, type DefineElementSchema } from '@bitran-js/core';

import type { LinkTarget } from './target';
import type { Component } from 'vue';

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
