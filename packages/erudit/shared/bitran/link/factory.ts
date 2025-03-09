import {
    RegexpInlinerParseFactory,
    StringifyFactory,
} from '@bitran-js/transpiler';

import type { LinkSchema } from './shared';

export class LinkParser extends RegexpInlinerParseFactory<LinkSchema> {
    regexp = /\[(.+?)\]\((.+?)\)/gm;

    override async parseDataFromRegexp(match: RegExpExecArray) {
        return {
            label: match[1]!,
            target: match[2]!,
        };
    }
}

export class LinkStringifier extends StringifyFactory<LinkSchema> {
    override async stringifyElement(): Promise<string> {
        const { parseData } = this.payload();
        return `[${parseData.label}](${parseData.target})`;
    }
}
