import { BlocksNode } from '@bitran-js/core';
import {
    BlockParseFactory,
    StringifyFactory,
    indent,
} from '@bitran-js/transpiler';

import type { DeatilsSchema } from './shared';

export class DetailsParser extends BlockParseFactory<DeatilsSchema> {
    regexp = /^@details$([\S\s]+)/m;
    strContent!: string;

    override canParse(strBlock: string): boolean {
        const match = this.regexp.exec(strBlock);

        if (match) {
            this.strContent = match[1]!;
            return true;
        }

        return false;
    }

    override async createParseData(): Promise<BlocksNode> {
        const { node } = this.payload();

        if (!node.meta.id)
            throw new Error('Details element must have an explicit ID!');

        const content = new BlocksNode(node);
        content.setNodes(await this.parseBlocks(this.strContent));
        return content;
    }
}

export class DetailsStringifier extends StringifyFactory<DeatilsSchema> {
    override async stringifyElement(): Promise<string> {
        const { parseData } = this.payload();
        return `@details\n${indent(await this.stringify(parseData))}`;
    }
}
