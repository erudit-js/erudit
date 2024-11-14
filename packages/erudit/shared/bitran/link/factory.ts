import {
    RegexpInlinerParseFactory,
    StringifyFactory,
} from '@bitran-js/transpiler';

import type { LinkNode, LinkSchema } from './shared';

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
    override async stringifyElement(elementNode: LinkNode): Promise<string> {
        const parseData = elementNode.parseData;
        return `[${parseData.label}](${parseData.target})`;
    }
}
