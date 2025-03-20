import { BlockErrorNode, ParagraphNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import { detailsName, DetailsNode } from '../../src/elements/details/shared';
import { detailsTranspiler } from '../../src/elements/details/transpiler';

const bitran = defineBitranTranspiler({
    [detailsName]: detailsTranspiler,
});

it('Should correctly parse and stringify valid details', async () => {
    const text = `
{ #myId }
@details
    This is some content inside the details element.
    It can contain multiple lines.
    `.trim();

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(DetailsNode);

    const detailsNode = parsed.children![0] as DetailsNode;
    expect(detailsNode.meta.id).toBe('myId');

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text);
});

it('Should properly handle multiple details elements', async () => {
    const text = `
{ #first }
@details
    First details content.

{ #second }
@details
    Second details content.
    `.trim();

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children!.length).toBe(2);
    expect(parsed.children![0]).toBeInstanceOf(DetailsNode);
    expect(parsed.children![1]).toBeInstanceOf(DetailsNode);

    expect((parsed.children![0] as DetailsNode).meta.id).toBe('first');
    expect((parsed.children![1] as DetailsNode).meta.id).toBe('second');

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text);
});

it('Should treat text that resembles details but violates structure as paragraphs', async () => {
    const texts = [
        '@details', // No content
        '@details   ', // Only whitespace
        '{ #myId }\n@details   ', // ID but only whitespace content
        '@details\n', // Empty line
        '{ #myId }\n@details\n', // ID with empty line
        '{ #myId }\n@details\n    \n    ', // ID with only whitespace in content
    ];

    for (const text of texts) {
        const parsed = await bitran.parser.parse(text);
        expect(parsed.children![0]).toBeInstanceOf(ParagraphNode);
    }
});

it('Should create error for details without ID', async () => {
    const text = `
@details
    This has content but no ID.
    `.trim();

    const parsed = await bitran.parser.parse(text);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should preserve content structure within details', async () => {
    const text = `
{ #structured }
@details
    This is a paragraph.

    This is another paragraph.
    `.trim();

    const parsed = await bitran.parser.parse(text);
    const detailsNode = parsed.children![0] as DetailsNode;

    expect(detailsNode.parseData.children!.length).toBeGreaterThan(1);
    expect(await bitran.stringifier.stringify(parsed)).toEqual(text);
});
