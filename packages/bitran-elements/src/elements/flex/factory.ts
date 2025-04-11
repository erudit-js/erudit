import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    type PlainObject,
} from '@bitran-js/transpiler';

import { flexName, type FlexParseData, type FlexSchema } from './shared';

export class FlexParser extends ObjBlockParseFactory<FlexSchema> {
    override objName = flexName;

    override async parseDataFromObj(obj: any): Promise<FlexParseData> {
        const strBlocks = obj.blocks;
        const { gap, arrange } = obj;

        if (typeof strBlocks !== 'string' || !strBlocks) {
            throw new Error(
                `Flex element must have non-empty string "blocks" property!`,
            );
        }

        if (gap !== undefined && typeof gap !== 'string') {
            throw new Error(`Flex element "gap" property must be a string!`);
        }

        if (arrange !== undefined) {
            if (typeof arrange !== 'string') {
                throw new Error(
                    `Flex element "arrange" property must be a string!`,
                );
            }

            const validValues = [
                'flex-start',
                'flex-end',
                'center',
                'space-between',
                'space-around',
                'space-evenly',
                'start',
                'end',
                'left',
                'right',
            ];

            if (!validValues.includes(arrange)) {
                throw new Error(
                    `Flex element "arrange" property must be a valid justify-content value!`,
                );
            }
        }

        return {
            blocks: await this.parseBlocks(strBlocks),
            gap,
            arrange,
        };
    }
}

export class FlexStringifier extends ObjStringifyFactory<FlexSchema> {
    override objName = flexName;

    override async createStrData(): Promise<any> {
        const { parseData } = this.payload();
        const result: PlainObject = {};

        if (parseData.gap !== undefined) {
            result.gap = parseData.gap;
        }

        if (parseData.arrange !== undefined) {
            result.arrange = parseData.arrange;
        }

        result.blocks = await this.stringify(parseData.blocks);

        return result;
    }
}
