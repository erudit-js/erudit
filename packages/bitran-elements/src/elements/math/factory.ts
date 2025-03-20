import {
    BlockParseFactory,
    RegexpInlinerParseFactory,
    StringifyFactory,
} from '@bitran-js/transpiler';

import type {
    BlockMathSchema,
    InlineMathSchema,
    MathParseData,
} from './shared';

const calculateMathRange = (match: RegExpExecArray): [number, number] => {
    const math = match[1]!;
    const start = match[0].indexOf(math);
    return [start, start + math.length];
};

export class BlockMathParser extends BlockParseFactory<BlockMathSchema> {
    objectRegexp = /^@math$([\S\s]+)/m;
    dollarRegexp = /^\$\$([\S\s]+?)\$\$$/m;

    range!: [number, number];

    override canParse(strBlock: string): boolean {
        const tryFindMath = (regexp: RegExp, str: string) => {
            const match = regexp.exec(str);
            return match && match.index === 0 ? match : false;
        };

        let match =
            tryFindMath(this.objectRegexp, strBlock) ||
            tryFindMath(this.dollarRegexp, strBlock);

        if (!match) return false;

        this.range = calculateMathRange(match);
        return true;
    }

    override async createParseData(strBlock: string): Promise<MathParseData> {
        return {
            src: strBlock,
            range: this.range,
        };
    }
}

export class InlineMathParser extends RegexpInlinerParseFactory<InlineMathSchema> {
    regexp = /\$([^\$]+)\$/g;

    override async parseDataFromRegexp(match: RegExpExecArray) {
        return {
            src: match[0],
            range: calculateMathRange(match),
        };
    }
}

export class MathStringifier extends StringifyFactory<
    BlockMathSchema | InlineMathSchema
> {
    override async stringifyElement() {
        const { parseData } = this.payload();
        return parseData.src;
    }
}
