import { BlockErrorNode, ParagraphNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import { includeName, IncludeNode } from '../../src/elements/include/shared';
import { includeTranspiler } from '../../src/elements/include/transpiler';

const bitran = defineBitranTranspiler({
    [includeName]: includeTranspiler,
});

it('Should correctly parse and stringify normal includes', async () => {
    const text = `
<~ definition:set

<~ group|triangle|theorem:pifagorean-theorem

<~ summary|baz
    `.trim();

    const parsed = await bitran.parser.parse(text);

    const locations = [
        'definition:set',
        'group|triangle|theorem:pifagorean-theorem',
        'summary|baz',
    ];

    expect(
        parsed.children!.map(
            (node) => (node as IncludeNode).parseData.location,
        ),
    ).toEqual(locations);

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text);
});

it('Should correctly parse and stringify resolved includes', async () => {
    const text = `
@include
    location: foo
    resolved: true
    blocks: |
        Paragraph 1

        Paragraph 2
    `.trim();

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children![0]).toBeInstanceOf(IncludeNode);

    expect((parsed.children![0] as IncludeNode).parseData).toEqual({
        location: 'foo',
        resolved: true,
        blocks: expect.anything(),
    });

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text);
});

it('Should treat text that resembles includes but violates structure as paragraphs', async () => {
    const text = `<~

<~

<~ one two three

<~ id
text

Some
<~ id`;

    const paragraphs = (await bitran.parser.parse(text)).children!;

    for (const paragraph of paragraphs) {
        expect(paragraph).toBeInstanceOf(ParagraphNode);
    }
});

it('Should handle resolved include error', async () => {
    const text = `
@include
    location: foo
    error: "Could not resolve include"
    `.trim();

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text);
});
