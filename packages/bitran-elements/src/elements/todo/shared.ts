import {
    BlockNode,
    type BlocksNode,
    type DefineElementSchema,
} from '@bitran-js/core';

export const todoName = 'todo';

export interface TodoParseData {
    title: string;
    content?: BlocksNode;
}

export type TodoSchema = DefineElementSchema<{
    ParseData: TodoParseData;
}>;

export class TodoNode extends BlockNode<TodoSchema> {
    override get children() {
        return this.parseData.content ? [this.parseData.content] : undefined;
    }
}
