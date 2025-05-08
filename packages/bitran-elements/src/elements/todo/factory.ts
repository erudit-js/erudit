import {
    ObjBlockParseFactory,
    ObjStringifyFactory,
    type PlainObject,
} from '@bitran-js/transpiler';

import { todoName, type TodoParseData, type TodoSchema } from './shared';

export class TodoParser extends ObjBlockParseFactory<TodoSchema> {
    override objName = todoName;

    override async parseDataFromObj(obj: PlainObject): Promise<TodoParseData> {
        const { title, content } = obj;

        if (typeof title !== 'string' && !title) {
            throw new Error(`Todo element must have a non-empty title!`);
        }

        return {
            title,
            content: content ? await this.parseBlocks(content) : undefined,
        };
    }
}

export class TodoStringifier extends ObjStringifyFactory<TodoSchema> {
    override objName = todoName;

    override async createStrData(): Promise<any> {
        const { parseData } = this.payload();

        return {
            title: parseData.title,
            content: parseData.content
                ? await this.stringify(parseData.content)
                : undefined,
        };
    }
}
