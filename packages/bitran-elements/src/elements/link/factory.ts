import {
    RegexpInlinerParseFactory,
    StringifyFactory,
} from '@bitran-js/transpiler';

import type { LinkSchema } from './shared';

const ESCAPE = ['$', '[', ']'];
const ESCAPE_REGEXP = ESCAPE.map((s) => '\\' + s).join('');
const unescapeRe = new RegExp(`\\\\([${ESCAPE_REGEXP}])`, 'g');

// Parser regexp: label allows ESCAPE symbols only if escaped with backslash
// [label](target), label: (?:[^\[\\\]\$]|\\[\[\]\$])+
export class LinkParser extends RegexpInlinerParseFactory<LinkSchema> {
    regexp = new RegExp(
        // [ (start)
        '\\[' +
            // label: (any non-ESCAPE char OR backslash+ESCAPE char), non-greedy
            `((?:[^${ESCAPE_REGEXP}\\\\]|\\\\[${ESCAPE_REGEXP}])+)` +
            '\\]' +
            // (target)
            '\\((.+?)\\)',
        'gm',
    );

    override async parseDataFromRegexp(match: RegExpExecArray) {
        return {
            label: match[1]!.replace(unescapeRe, '$1'),
            target: match[2]!,
        };
    }
}

export class LinkStringifier extends StringifyFactory<LinkSchema> {
    override async stringifyElement(): Promise<string> {
        const { parseData } = this.payload();
        const escapeRegexp = new RegExp(`[${ESCAPE_REGEXP}]`, 'g');
        const escapedLabel = parseData.label.replace(
            escapeRegexp,
            (m: string) => '\\' + m,
        );
        return `[${escapedLabel}](${parseData.target})`;
    }
}
