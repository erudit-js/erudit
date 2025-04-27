import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    TodoNode,
    todoName,
    type TodoParseData,
} from '../../src/elements/todo/shared';
import { todoTranspiler } from '../../src/elements/todo/transpiler';

const bitran = defineBitranTranspiler({
    [todoName]: todoTranspiler,
});

it('Should correctly parse and stringify todo with title and content', async () => {
    const text = `
@todo
    title: Complete documentation
    content: |
        - Update API reference
        - Add more examples
        - Review existing docs
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const todoNode = parsed.children![0] as TodoNode;
    expect(todoNode).toBeInstanceOf(TodoNode);

    const parseData = todoNode.parseData as TodoParseData;
    expect(parseData.title).toBe('Complete documentation');
    expect(parseData.content).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify todo with title only', async () => {
    const text = `
@todo
    title: Simple reminder
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const todoNode = parsed.children![0] as TodoNode;
    expect(todoNode).toBeInstanceOf(TodoNode);

    const parseData = todoNode.parseData as TodoParseData;
    expect(parseData.title).toBe('Simple reminder');
    expect(parseData.content).toBeUndefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject todo without title', async () => {
    const text = `
@todo
    content: This todo is missing a title.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should handle multiline content correctly', async () => {
    const text = `
@todo
    title: Complex Task
    content: |
        This is a complex task with multiple lines.

        It includes:
        - Multiple bullet points
        - With detailed descriptions

        And even paragraphs.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const todoNode = parsed.children![0] as TodoNode;
    expect(todoNode).toBeInstanceOf(TodoNode);

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});
