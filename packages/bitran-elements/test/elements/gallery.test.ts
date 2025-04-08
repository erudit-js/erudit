import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    GalleryNode,
    galleryName,
    type GalleryParseData,
} from '../../src/elements/gallery/shared';
import { galleryTranspiler } from '../../src/elements/gallery/transpiler';

const bitran = defineBitranTranspiler({
    [galleryName]: galleryTranspiler,
});

it('Should correctly parse and stringify gallery with one image', async () => {
    const text = `
@gallery
    images:
        - src: /path/to/image1.jpg
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const galleryNode = parsed.children![0] as GalleryNode;
    expect(galleryNode).toBeInstanceOf(GalleryNode);

    const parseData = galleryNode.parseData as GalleryParseData;
    expect(parseData.images).toBeDefined();
    expect(parseData.images.length).toBe(1);
    expect(parseData.images[0]!.src).toBe('/path/to/image1.jpg');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify gallery with multiple images', async () => {
    const text = `
@gallery
    images:
        - src: /path/to/image1.jpg
        - src: /path/to/image2.jpg
        - src: /path/to/image3.jpg
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const galleryNode = parsed.children![0] as GalleryNode;
    expect(galleryNode).toBeInstanceOf(GalleryNode);

    const parseData = galleryNode.parseData as GalleryParseData;
    expect(parseData.images).toBeDefined();
    expect(parseData.images.length).toBe(3);
    expect(parseData.images[0]!.src).toBe('/path/to/image1.jpg');
    expect(parseData.images[1]!.src).toBe('/path/to/image2.jpg');
    expect(parseData.images[2]!.src).toBe('/path/to/image3.jpg');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify gallery with images having properties', async () => {
    const text = `
@gallery
    images:
        - src: /path/to/image1.jpg
          invert: dark
        - src: /path/to/image2.jpg
          caption: Second image caption
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const galleryNode = parsed.children![0] as GalleryNode;
    expect(galleryNode).toBeInstanceOf(GalleryNode);

    const parseData = galleryNode.parseData as GalleryParseData;
    expect(parseData.images).toBeDefined();
    expect(parseData.images.length).toBe(2);
    expect(parseData.images[0]!.src).toBe('/path/to/image1.jpg');
    expect(parseData.images[0]!.invert).toBe('dark');
    expect(parseData.images[1]!.src).toBe('/path/to/image2.jpg');
    expect(parseData.images[1]!.caption).toBeDefined();
    expect(parseData.images[1]!.caption!.main).toBeDefined();

    // Check children nodes for captions
    expect(galleryNode.children).toBeDefined();
    expect(galleryNode.children!.length).toBe(1); // Only the second image has a caption

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify gallery with complex image captions', async () => {
    const text = `
@gallery
    images:
        - src: /path/to/image1.jpg
          caption:
              main: First image caption
              secondary: Additional details for first image
        - src: /path/to/image2.jpg
          caption:
              maxWidth: 800px
              main: Second image caption
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const galleryNode = parsed.children![0] as GalleryNode;
    expect(galleryNode).toBeInstanceOf(GalleryNode);

    const parseData = galleryNode.parseData as GalleryParseData;
    expect(parseData.images).toBeDefined();
    expect(parseData.images.length).toBe(2);

    expect(parseData.images[0]!.caption).toBeDefined();
    expect(parseData.images[0]!.caption!.main).toBeDefined();
    expect(parseData.images[0]!.caption!.secondary).toBeDefined();

    expect(parseData.images[1]!.caption).toBeDefined();
    expect(parseData.images[1]!.caption!.main).toBeDefined();
    expect(parseData.images[1]!.caption!.maxWidth).toBe('800px');

    // Check children nodes for captions
    expect(galleryNode.children).toBeDefined();
    expect(galleryNode.children!.length).toBe(3); // First image has both main and secondary, second has main

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject gallery without images array', async () => {
    const text = `
@gallery
    notImages: []
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject gallery with empty images array', async () => {
    const text = `
@gallery
    images: []
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject gallery with invalid image data', async () => {
    const text = `
@gallery
    images:
        - notSrc: this is missing the src property
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject gallery with invalid caption in image', async () => {
    const text = `
@gallery
    images:
        - src: /path/to/image.jpg
          caption:
            secondary: Missing main caption property
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
