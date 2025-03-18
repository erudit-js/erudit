import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    ListNode,
    listName,
    type ListOrderedParseData,
    type ListUnorderedParseData,
} from '../../src/elements/list/shared';
import { listTranspiler } from '../../src/elements/list/transpiler';

const bitran = defineBitranTranspiler({
    [listName]: listTranspiler,
});

it('Should correctly parse and stringify inline lists', async () => {
    const text = `
* First item * Same item
* Second item
* Third item

1. First ordered item
10. Same item
2. Second ordered item
3. Third ordered item

5. Item five
10. Same item
6. Item six
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(3);

    // Check the first unordered list
    const firstList = parsed.children![0] as ListNode;
    expect(firstList).toBeInstanceOf(ListNode);
    const firstListData = firstList.parseData as ListUnorderedParseData;
    expect(firstListData.type).toBe('ul');
    expect(firstListData.items.length).toBe(3);

    // Check the second ordered list
    const secondList = parsed.children![1] as ListNode;
    expect(secondList).toBeInstanceOf(ListNode);
    const secondListData = secondList.parseData as ListOrderedParseData;
    expect(secondListData.type).toBe('ol');
    expect(secondListData.start).toBe(1);
    expect(secondListData.items.length).toBe(3);

    // Check the third ordered list with custom start
    const thirdList = parsed.children![2] as ListNode;
    expect(thirdList).toBeInstanceOf(ListNode);
    const thirdListData = thirdList.parseData as ListOrderedParseData;
    expect(thirdListData.type).toBe('ol');
    expect(thirdListData.start).toBe(5);
    expect(thirdListData.items.length).toBe(2);

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify object lists', async () => {
    const text = `
@list
    type: ul
    items:
        - First item
        - Second item
        - Third item

@list
    type: ol
    items:
        - First ordered item
        - Second ordered item
        - Third ordered item

@list
    type: ol
    start: 5
    items:
        - Item five
        - Item six
        - Item seven
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(3);

    // Check the first unordered list
    const firstList = parsed.children![0] as ListNode;
    expect(firstList).toBeInstanceOf(ListNode);
    const firstListData = firstList.parseData as ListUnorderedParseData;
    expect(firstListData.type).toBe('ul');
    expect(firstListData.isObj).toBe(true);
    expect(firstListData.items.length).toBe(3);

    // Check the second ordered list
    const secondList = parsed.children![1] as ListNode;
    expect(secondList).toBeInstanceOf(ListNode);
    const secondListData = secondList.parseData as ListOrderedParseData;
    expect(secondListData.type).toBe('ol');
    expect(secondListData.isObj).toBe(true);
    expect(secondListData.start).toBe(1);
    expect(secondListData.items.length).toBe(3);

    // Check the third ordered list with custom start
    const thirdList = parsed.children![2] as ListNode;
    expect(thirdList).toBeInstanceOf(ListNode);
    const thirdListData = thirdList.parseData as ListOrderedParseData;
    expect(thirdListData.type).toBe('ol');
    expect(thirdListData.isObj).toBe(true);
    expect(thirdListData.start).toBe(5);
    expect(thirdListData.items.length).toBe(3);

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject list with invalid type', async () => {
    const text = `
@list
    type: invalid
    items:
        - First item
        - Second item
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject ordered list with non-numeric start', async () => {
    const text = `
@list
    type: ol
    start: invalid
    items:
        - First item
        - Second item
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject list with non-array items', async () => {
    const text = `
@list
    type: ul
    items: "Not an array"
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject list with non-string array items', async () => {
    const text = `
@list
    type: ul
    items:
        - 123
        - true
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
