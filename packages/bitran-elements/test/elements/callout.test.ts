import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    CalloutNode,
    calloutName,
    type CalloutIconDefault,
    type CalloutIconCustom,
    type CalloutParseData,
} from '../../src/elements/callout/shared';
import { calloutTranspiler } from '../../src/elements/callout/transpiler';

const bitran = defineBitranTranspiler({
    [calloutName]: calloutTranspiler,
});

it('Should correctly parse and stringify callout with default icon', async () => {
    const text = `
@callout
    title: A Simple Quote
    icon: quote
    content: |
        This is a quote content.
        It can have multiple lines.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const calloutNode = parsed.children![0] as CalloutNode;
    expect(calloutNode).toBeInstanceOf(CalloutNode);

    const parseData = calloutNode.parseData as CalloutParseData;
    expect(parseData.icon.type).toBe('default');
    const defaultIcon = parseData.icon as CalloutIconDefault;
    expect(defaultIcon.calloutType).toBe('quote');
    expect(parseData.title).toBe('A Simple Quote');
    expect(parseData.content).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify callout with string custom icon', async () => {
    const text = `
@callout
    title: Custom Icon Callout
    icon: /path/to/icon.svg
    content: |
        This is content with a custom icon.

        Second line.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const calloutNode = parsed.children![0] as CalloutNode;
    expect(calloutNode).toBeInstanceOf(CalloutNode);

    const parseData = calloutNode.parseData as CalloutParseData;
    expect(parseData.icon.type).toBe('custom');
    const customIcon = parseData.icon as CalloutIconCustom;
    expect(customIcon.src).toBe('/path/to/icon.svg');
    expect(parseData.title).toBe('Custom Icon Callout');
    expect(parseData.content).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify callout with object custom icon', async () => {
    const text = `
@callout
    title: Object Icon Callout
    icon:
        src: /path/to/icon.svg
        invert: dark
    content: |
        This is content with a custom icon with invert property.

        Second line.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const calloutNode = parsed.children![0] as CalloutNode;
    expect(calloutNode).toBeInstanceOf(CalloutNode);

    const parseData = calloutNode.parseData as CalloutParseData;
    expect(parseData.icon.type).toBe('custom');
    const customIcon = parseData.icon as CalloutIconCustom;
    expect(customIcon.src).toBe('/path/to/icon.svg');
    expect(customIcon.invert).toBe('dark');
    expect(parseData.title).toBe('Object Icon Callout');
    expect(parseData.content).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject callouts without content', async () => {
    const text = `
@callout
    title: Missing Content
    icon: quote
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject callouts without title', async () => {
    const text = `
@callout
    icon: quote
    content: This callout is missing a title.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject callouts without icon', async () => {
    const text = `
@callout
    title: Missing Icon
    content: This is content without an icon.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject callouts with invalid icon value', async () => {
    const text = `
@callout
    title: Invalid Icon
    icon: 123
    content: This has an invalid icon.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject callouts with custom icon missing src', async () => {
    const text = `
@callout
    title: Missing Src
    icon:
        invert: light
    content: This has an invalid icon without src.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject callouts with invalid invert value', async () => {
    const text = `
@callout
    title: Invalid Invert
    icon:
        src: /path/to/icon.svg
        invert: invalid
    content: This has an invalid invert value.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject callouts with non-string content', async () => {
    const text = `
@callout
    title: Non-string Content
    icon: quote
    content: 123
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
