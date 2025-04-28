import { BlockParseFactory, StringifyFactory } from '@bitran-js/transpiler';

import type { HrSchema } from './shared';

export class HrParser extends BlockParseFactory<HrSchema> {
    override canParse(strBlock: string) {
        return strBlock.trim() === '---';
    }

    override async createParseData(strBlock: string) {
        return;
    }
}

export class HrStringifier extends StringifyFactory<HrSchema> {
    override async stringifyElement() {
        return '---';
    }
}
