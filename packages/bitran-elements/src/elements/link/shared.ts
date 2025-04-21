import {
    InlinerNode,
    type DefineElementSchema,
    type RenderDataGenerator,
} from '@bitran-js/core';

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

export const linkRenderDataGenerator: RenderDataGenerator<LinkSchema> = {
    createKey({ node }) {
        return `${linkName}:${node.parseData.target}`;
    },
};
