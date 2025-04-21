import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import { FlexNode, flexName } from '../../src/elements/flex/shared';
import { flexTranspiler } from '../../src/elements/flex/transpiler';

const bitran = defineBitranTranspiler({
    [flexName]: flexTranspiler,
});

it('Should correctly parse and stringify flex element with blocks', async () => {
    const text = `
@flex
    blocks: |
        This is block 1.

        This is block 2.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the flex element
    const flex = parsed.children![0] as FlexNode;
    expect(flex).toBeInstanceOf(FlexNode);
    expect(flex.parseData.blocks).toBeDefined();
    expect(flex.parseData.blocks.children).toBeDefined();
    expect(flex.parseData.blocks.children!.length).toBe(2); // Two blocks inside

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify flex element with nested blocks', async () => {
    const text = `
@flex
    blocks: |
        This is a paragraph.

        * List item 1
        * List item 2

        Another paragraph.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the flex element
    const flex = parsed.children![0] as FlexNode;
    expect(flex).toBeInstanceOf(FlexNode);
    expect(flex.parseData.blocks).toBeDefined();
    expect(flex.parseData.blocks.children).toBeDefined();
    expect(flex.parseData.blocks.children!.length).toBe(3); // Three blocks inside (paragraph, list, paragraph)

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject flex element with missing blocks property', async () => {
    const text = `
@flex
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject flex element with non-string blocks property', async () => {
    const text = `
@flex
    blocks: 123
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject empty blocks property', async () => {
    const text = `
@flex
    blocks: |
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should correctly parse and stringify flex element with gap property', async () => {
    const text = `
@flex
    gap: 20px
    blocks: |
        This is block 1.

        This is block 2.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the flex element
    const flex = parsed.children![0] as FlexNode;
    expect(flex).toBeInstanceOf(FlexNode);
    expect(flex.parseData.gap).toBe('20px');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify flex element with arrange property', async () => {
    const text = `
@flex
    arrange: space-between
    blocks: |
        This is block 1.

        This is block 2.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the flex element
    const flex = parsed.children![0] as FlexNode;
    expect(flex).toBeInstanceOf(FlexNode);
    expect(flex.parseData.arrange).toBe('space-between');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify flex element with both gap and arrange properties', async () => {
    const text = `
@flex
    gap: 30px
    arrange: center
    blocks: |
        This is block 1.

        This is block 2.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the flex element
    const flex = parsed.children![0] as FlexNode;
    expect(flex).toBeInstanceOf(FlexNode);
    expect(flex.parseData.gap).toBe('30px');
    expect(flex.parseData.arrange).toBe('center');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject flex element with invalid arrange property', async () => {
    const text = `
@flex
    arrange: invalid-value
    blocks: |
        This is block 1.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject flex element with non-string gap property', async () => {
    const text = `
@flex
    gap: 123
    blocks: |
        This is block 1.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
