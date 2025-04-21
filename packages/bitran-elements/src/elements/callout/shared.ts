import {
    BlockNode,
    type BlocksNode,
    type DefineElementSchema,
    type RenderDataGenerator,
} from '@bitran-js/core';

export const calloutName = 'callout';

export const defaultCalloutTypes = ['quote', 'joke'];

export type CalloutIconType = 'default' | 'custom';

export interface CalloutIconBase {
    type: CalloutIconType;
}

export interface CalloutIconDefault extends CalloutIconBase {
    type: 'default';
    calloutType: (typeof defaultCalloutTypes)[number];
}

export interface CalloutIconCustom extends CalloutIconBase {
    type: 'custom';
    src: string;
    invert?: 'light' | 'dark';
}

export type CalloutIcon = CalloutIconDefault | CalloutIconCustom;

export interface CalloutParseData {
    icon: CalloutIcon;
    title: string;
    content: BlocksNode;
}

export type CalloutSchema = DefineElementSchema<{
    ParseData: CalloutParseData;
    RenderData: string;
}>;

export class CalloutNode extends BlockNode<CalloutSchema> {
    override get children() {
        return this.parseData.content ? [this.parseData.content] : undefined;
    }
}

export const calloutRenderDataGenerator: RenderDataGenerator<CalloutSchema> = {
    createKey({ node }) {
        if (node.parseData.icon.type === 'default') {
            return undefined;
        }

        return `${calloutName}:${node.parseData.icon.src}`;
    },
};
