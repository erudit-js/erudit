import {
    RegexpInlinerParseFactory,
    StringifyFactory,
} from '@bitran-js/transpiler';

import type { EmphasisSchema } from './shared';

export class StrongParser extends RegexpInlinerParseFactory<EmphasisSchema> {
    regexp = /\*\*(.+?)\*\*/gm;

    override async parseDataFromRegexp(match: RegExpExecArray) {
        const inliners = await this.parseInliners(match[1]!);
        return {
            type: 'bold' as const,
            inliners,
        };
    }
}

export class ItalicParser extends RegexpInlinerParseFactory<EmphasisSchema> {
    regexp = /\*(.+?)\*/gm;

    override async parseDataFromRegexp(match: RegExpExecArray) {
        const inliners = await this.parseInliners(match[1]!);
        return {
            type: 'italic' as const,
            inliners,
        };
    }
}

export class EmphasisStringifier extends StringifyFactory<EmphasisSchema> {
    override async stringifyElement(): Promise<string> {
        const { parseData } = this.payload();
        const delimiter = parseData.type === 'bold' ? '**' : '*';
        return `${delimiter}${await this.stringify(parseData.inliners)}${delimiter}`;
    }
}
