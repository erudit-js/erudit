import {
    BlockParseFactory,
    ObjBlockParseFactory,
    objToText,
    StringifyFactory,
    type RawObject,
} from '@bitran-js/transpiler';

import {
    includeName,
    type IncludeParseData,
    type IncludeSchema,
} from './shared';

export class IncludeParser extends BlockParseFactory<IncludeSchema> {
    regexp = /^<~ (\S+)$/;
    location!: string;

    override canParse(strBlock: string): boolean {
        const match = strBlock.match(this.regexp);

        if (match && match[1]) {
            this.location = match[1];
            return true;
        }

        return false;
    }

    override async createParseData(): Promise<IncludeParseData> {
        return {
            location: this.location,
        };
    }
}

export class ResolvedIncludeParser extends ObjBlockParseFactory<IncludeSchema> {
    override objName = includeName;

    override async parseDataFromObj(obj: RawObject): Promise<IncludeParseData> {
        if (obj.error) throw obj.error;

        return {
            location: obj.location,
            resolved: true,
            blocks: await this.parseBlocks(obj.blocks),
        };
    }
}

export class IncludeStringifier extends StringifyFactory<IncludeSchema> {
    override async stringifyElement() {
        const { parseData } = this.payload();

        if (parseData.resolved) {
            const obj: any = {};

            obj.location = parseData.location;
            obj.resolved = true;

            if (parseData.error) obj.error = parseData.error;
            else obj.blocks = await this.stringify(parseData.blocks!);

            return objToText(includeName, obj);
        } else {
            return `<~ ${parseData.location}`;
        }
    }
}
