import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    VideoNode,
    videoName,
    type VideoParseData,
} from '../../src/elements/video/shared';
import { videoTranspiler } from '../../src/elements/video/transpiler';

const bitran = defineBitranTranspiler({
    [videoName]: videoTranspiler,
});

it('Should correctly parse and stringify video with only src', async () => {
    const text = `
@video
    src: /path/to/video.mp4
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const videoNode = parsed.children![0] as VideoNode;
    expect(videoNode).toBeInstanceOf(VideoNode);

    const parseData = videoNode.parseData as VideoParseData;
    expect(parseData.src).toBe('/path/to/video.mp4');
    expect(parseData.invert).toBeUndefined();
    expect(parseData.caption).toBeUndefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify video with src and invert', async () => {
    const text = `
@video
    src: /path/to/video.mp4
    invert: dark
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const videoNode = parsed.children![0] as VideoNode;
    expect(videoNode).toBeInstanceOf(VideoNode);

    const parseData = videoNode.parseData as VideoParseData;
    expect(parseData.src).toBe('/path/to/video.mp4');
    expect(parseData.invert).toBe('dark');
    expect(parseData.autoplay.explicit).toBe(false);
    expect(parseData.autoplay.value).toBe(true);
    expect(parseData.caption).toBeUndefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify video with src and autoplay', async () => {
    const text = `
@video
    src: /path/to/video.mp4
    autoplay: false
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const videoNode = parsed.children![0] as VideoNode;
    expect(videoNode).toBeInstanceOf(VideoNode);

    const parseData = videoNode.parseData as VideoParseData;
    expect(parseData.src).toBe('/path/to/video.mp4');
    expect(parseData.autoplay.explicit).toBe(true);
    expect(parseData.autoplay.value).toBe(false);
    expect(parseData.invert).toBeUndefined();
    expect(parseData.caption).toBeUndefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify video with src and simple caption', async () => {
    const text = `
@video
    src: /path/to/video.mp4
    caption: Simple caption text
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const videoNode = parsed.children![0] as VideoNode;
    expect(videoNode).toBeInstanceOf(VideoNode);

    const parseData = videoNode.parseData as VideoParseData;
    expect(parseData.src).toBe('/path/to/video.mp4');
    expect(parseData.caption).toBeDefined();
    expect(parseData.caption!.main).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify video with all properties', async () => {
    const text = `
@video
    src: /path/to/video.mp4
    autoplay: true
    invert: light
    maxWidth: 600px
    caption:
        main: Main caption text
        secondary: Secondary description
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const videoNode = parsed.children![0] as VideoNode;
    expect(videoNode).toBeInstanceOf(VideoNode);

    const parseData = videoNode.parseData as VideoParseData;
    expect(parseData.src).toBe('/path/to/video.mp4');
    expect(parseData.invert).toBe('light');
    expect(parseData.autoplay.explicit).toBe(true);
    expect(parseData.autoplay.value).toBe(true);
    expect(parseData.maxWidth).toBe('600px');
    expect(parseData.caption).toBeDefined();
    expect(parseData.caption!.main).toBeDefined();
    expect(parseData.caption!.secondary).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject videos without src', async () => {
    const text = `
@video
    caption:
        main: Caption without video source
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject videos with invalid invert value', async () => {
    const text = `
@video
    src: /path/to/video.mp4
    invert: invalid-mode
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject videos with caption missing main property', async () => {
    const text = `
@video
    src: /path/to/video.mp4
    caption:
        secondary: Secondary without main caption
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject videos with non-string src', async () => {
    const text = `
@video
    src: 123
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
