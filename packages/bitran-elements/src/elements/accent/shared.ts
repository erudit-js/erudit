import {
    BlockNode,
    BlocksNode,
    type DefineElementSchema,
} from '@bitran-js/core';

export type AccentParseDataType = 'simple' | 'complex';

export interface AccentBaseParseData {
    type: AccentParseDataType;
    objName: string;
    title?: string;
}

export interface AccentSimpleParseData extends AccentBaseParseData {
    type: 'simple';
    main: BlocksNode;
}

export interface AccentSection {
    id: string;
    title?: string;
    content: BlocksNode;
}

export interface AccentComplexParseData extends AccentBaseParseData {
    type: 'complex';
    main?: BlocksNode;
    direction?: 'row' | 'column';
    sections: AccentSection[];
}

export type AccentParseData = AccentSimpleParseData | AccentComplexParseData;

export interface AccentProvide {
    objName: string;
}

export interface AccentRenderData {
    colors: {
        text: string;
        border: string;
        background: string;
    };
}

export type AccentSchema = DefineElementSchema<{
    ParseData: AccentParseData;
    Provide: AccentProvide;
    RenderData: AccentRenderData;
}>;

export class AccentNode extends BlockNode<AccentSchema> {
    override get children() {
        const children: BlocksNode[] = [];

        if (this.parseData.type === 'simple') {
            children.push(this.parseData.main);
        } else {
            if (this.parseData.main) {
                children.push(this.parseData.main);
            }

            for (const section of this.parseData.sections) {
                children.push(section.content);
            }
        }

        return children.length ? children : undefined;
    }
}
