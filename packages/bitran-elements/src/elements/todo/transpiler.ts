import { defineElementTranspiler } from "@bitran-js/transpiler";

import { TodoNode, type TodoSchema } from "./shared";
import { TodoParser, TodoStringifier } from "./factory";

export const todoTranspiler = defineElementTranspiler<TodoSchema>({
    Node: TodoNode,
    Parsers: [TodoParser],
    Stringifier: TodoStringifier,
});