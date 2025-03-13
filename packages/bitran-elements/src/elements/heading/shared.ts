import { BlockNode, type DefineElementSchema } from '@bitran-js/core';

export const headingName = 'heading';

export interface HeadingParseData {
    level: number;
    title: string;
}

export type HeadingSchema = DefineElementSchema<{
    ParseData: HeadingParseData;
}>;

export class HeadingNode extends BlockNode<HeadingSchema> {}
