import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    TableNode,
    tableName,
    type TableParseData,
} from '../../src/elements/table/shared';
import { tableTranspiler } from '../../src/elements/table/transpiler';

const bitran = defineBitranTranspiler({
    [tableName]: tableTranspiler,
});

it('Should correctly parse and stringify a simple table', async () => {
    const text = `
@table
    FirstName | LastName | Height
    Joe | Soap | 184
    Mary | Ryan | 169
    Alex | Dole | 174
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.cells.length).toBe(4); // 4 rows
    expect(parseData.cells[0]!.length).toBe(3); // 3 columns in the first row

    // Check content of specific cells
    expect(await bitran.stringifier.stringify(parseData.cells[0]![0]!)).toBe(
        'FirstName ',
    );
    expect(await bitran.stringifier.stringify(parseData.cells[1]![1]!)).toBe(
        ' Soap ',
    );
    expect(await bitran.stringifier.stringify(parseData.cells[2]![2]!)).toBe(
        ' 169',
    );
    expect(await bitran.stringifier.stringify(parseData.cells[3]![0]!)).toBe(
        'Alex ',
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify a table with a single row', async () => {
    const text = `
@table
    Column1 | Column2 | Column3 | Column4
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.cells.length).toBe(1); // 1 row
    expect(parseData.cells[0]!.length).toBe(4); // 4 columns

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify a table with a single column', async () => {
    const text = `
@table
    Header
    Value1
    Value2
    Value3
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.cells.length).toBe(4); // 4 rows
    expect(parseData.cells[0]!.length).toBe(1); // 1 column

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly handle empty cells', async () => {
    const text = `
@table
    Header1 | Header2 | Header3
    Value1 |  | Value3
     | Value2 |
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.cells.length).toBe(3); // 3 rows

    // Check empty cells
    expect(await bitran.stringifier.stringify(parseData.cells[1]![1]!)).toBe(
        '  ',
    );
    expect(await bitran.stringifier.stringify(parseData.cells[2]![0]!)).toBe(
        ' ',
    );
    expect(await bitran.stringifier.stringify(parseData.cells[2]![2]!)).toBe(
        '',
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly handle escaped pipe characters', async () => {
    const text = `
@table
    Header1 | Header\\|with\\|pipes | Header3
    Value1 | Normal | Value3
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.cells.length).toBe(2);

    // Check cell with escaped pipes
    expect(await bitran.stringifier.stringify(parseData.cells[0]![1]!)).toBe(
        ' Header|with|pipes ',
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject empty table', async () => {
    const text = `
@table
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should correctly parse and stringify a table with caption', async () => {
    const text = `
@table
    caption: Sample Table
    cells: |
        FirstName | LastName | Height
        Joe | Soap | 184
        Mary | Ryan | 169
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.cells.length).toBe(3); // 3 rows
    expect(parseData.caption).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify a table with detailed caption', async () => {
    const text = `
@table
    caption:
        maxWidth: 800px
        main: Population Statistics
        secondary: Data collected in 2023
    cells: |
        Country | Population | Growth Rate
        USA | 331M | 0.4%
        China | 1.4B | 0.3%
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.caption).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject table with caption missing main property', async () => {
    const text = `
@table
    caption:
        secondary: Missing main caption
    cells: |
        Column1 | Column2
        Value1 | Value2
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should correctly parse and stringify a table with maxWidth', async () => {
    const text = `
@table
    maxWidth: 600px
    cells: |
        FirstName | LastName | Height
        Joe | Soap | 184
        Mary | Ryan | 169
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.cells.length).toBe(3);
    expect(parseData.maxWidth).toBe('600px');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly handle rows starting with a pipe', async () => {
    const text = `
@table
    caption: Caption
    cells: |
        | Черный | Белый | Цветной
        A | B | C
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.cells.length).toBe(2);

    // First row should have empty first cell
    expect(parseData.cells[0]!.length).toBe(4);
    expect(await bitran.stringifier.stringify(parseData.cells[0]![0]!)).toBe(
        '',
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly handle rows starting and ending with pipes', async () => {
    const text = `
@table
    caption: Caption
    cells: |
        | Cell1 | Cell2 |
        | Data1 | Data2 |
`;

    const parsed = await bitran.parser.parse(text);
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should preserve backslashes', async () => {
    const text = `
@table
    $\\green{69}$ | My text
    Row2 | $\\frac{1}{2}$
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const tableNode = parsed.children![0] as TableNode;
    expect(tableNode).toBeInstanceOf(TableNode);

    const parseData = tableNode.parseData as TableParseData;
    expect(parseData.cells).toBeDefined();
    expect(parseData.cells.length).toBe(2);

    // Check cell with math expression containing backslashes
    const firstCell = await bitran.stringifier.stringify(
        parseData.cells[0]![0]!,
    );
    expect(firstCell).toBe('$\\green{69}$ ');

    const lastCell = await bitran.stringifier.stringify(
        parseData.cells[1]![1]!,
    );
    expect(lastCell).toBe(' $\\frac{1}{2}$');

    // Check stringification preserves the backslashes
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});
