import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    ImageNode,
    imageName,
    type ImageParseData,
} from '../../../src/elements/figures/image/shared';
import { imageTranspiler } from '../../../src/elements/figures/image/transpiler';

const bitran = defineBitranTranspiler({
    [imageName]: imageTranspiler,
});

it('Should correctly parse and stringify image with only src', async () => {
    const text = `
@image
    src: /path/to/image.jpg
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const imageNode = parsed.children![0] as ImageNode;
    expect(imageNode).toBeInstanceOf(ImageNode);

    const parseData = imageNode.parseData as ImageParseData;
    expect(parseData.src).toBe('/path/to/image.jpg');
    expect(parseData.invert).toBeUndefined();
    expect(parseData.caption).toBeUndefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify image with src and invert', async () => {
    const text = `
@image
    src: /path/to/image.jpg
    invert: dark
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const imageNode = parsed.children![0] as ImageNode;
    expect(imageNode).toBeInstanceOf(ImageNode);

    const parseData = imageNode.parseData as ImageParseData;
    expect(parseData.src).toBe('/path/to/image.jpg');
    expect(parseData.invert).toBe('dark');
    expect(parseData.caption).toBeUndefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify image with src and simple caption', async () => {
    const text = `
@image
    src: /path/to/image.jpg
    caption:
        main: Simple caption text
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const imageNode = parsed.children![0] as ImageNode;
    expect(imageNode).toBeInstanceOf(ImageNode);

    const parseData = imageNode.parseData as ImageParseData;
    expect(parseData.src).toBe('/path/to/image.jpg');
    expect(parseData.caption).toBeDefined();
    expect(parseData.caption!.main).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify image with all properties', async () => {
    const text = `
@image
    src: /path/to/image.jpg
    invert: light
    caption:
        maxWidth: 600px
        main: Main caption text
        secondary: Secondary description
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const imageNode = parsed.children![0] as ImageNode;
    expect(imageNode).toBeInstanceOf(ImageNode);

    const parseData = imageNode.parseData as ImageParseData;
    expect(parseData.src).toBe('/path/to/image.jpg');
    expect(parseData.invert).toBe('light');
    expect(parseData.caption).toBeDefined();
    expect(parseData.caption!.main).toBeDefined();
    expect(parseData.caption!.secondary).toBeDefined();
    expect(parseData.caption!.maxWidth).toBe('600px');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject images without src', async () => {
    const text = `
@image
    caption:
        main: Caption without image source
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject images with invalid invert value', async () => {
    const text = `
@image
    src: /path/to/image.jpg
    invert: invalid-mode
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject images with caption missing main property', async () => {
    const text = `
@image
    src: /path/to/image.jpg
    caption:
        secondary: Secondary without main caption
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject images with non-string src', async () => {
    const text = `
@image
    src: 123
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
