import type { BitranAliases } from '@erudit-js/cog/schema';
import { BlockParseFactory, StringifyFactory } from '@bitran-js/transpiler';

import type { AliasesSchema } from './shared';

export class AliasesParser extends BlockParseFactory<AliasesSchema> {
    regexp = /^~ (?<alias>\S+) (?<target>\S+)$/;
    aliasesArray: [string, string][] = [];

    override canParse(strBlock: string): boolean {
        const lines = strBlock.split('\n');

        for (const line of lines) {
            const match = line.match(this.regexp);
            if (!match) return false;
            this.aliasesArray.push([match[1]!.trim(), match[2]!.trim()]);
        }

        return true;
    }

    override async createParseData(): Promise<BitranAliases> {
        const aliases: BitranAliases = {};

        for (const [alias, target] of this.aliasesArray) {
            if (aliases[alias]) throw new Error(`Duplicate alias "${alias}"!`);
            aliases[alias] = target;
        }

        return aliases;
    }
}

export class AliasesStringifier extends StringifyFactory<AliasesSchema> {
    override async stringifyElement() {
        const { parseData: aliases } = this.payload();
        return Object.entries(aliases)
            .map(([alias, target]) => `~ ${alias} ${target}`)
            .join('\n');
    }
}
