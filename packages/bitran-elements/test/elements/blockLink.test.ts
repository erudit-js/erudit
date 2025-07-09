import { ParagraphNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    blockLinkName,
    BlockLinkNode,
} from '../../src/elements/blockLink/shared';
import { blockLinkTranspiler } from '../../src/elements/blockLink/transpiler';

const bitran = defineBitranTranspiler({
    [blockLinkName]: blockLinkTranspiler,
});

it('Should correctly parse and stringify valid blockLinks', async () => {
    const text = `~> location1 Label One

~> location2 Label Two

~> location3`;

    const parsed = await bitran.parser.parse(text);

    expect(
        parsed.children!.map((node) => (node as BlockLinkNode).parseData),
    ).toEqual([
        { location: 'location1', label: 'Label One' },
        { location: 'location2', label: 'Label Two' },
        { location: 'location3', label: undefined },
    ]);

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text);
});

it('Should correctly parse blockLinks with various spacing', async () => {
    const text = `~>   location1   Label with spaces

~> location2 SimpleLabel

~>    location3    `;

    const parsed = await bitran.parser.parse(text);

    expect(
        parsed.children!.map((node) => (node as BlockLinkNode).parseData),
    ).toEqual([
        { location: 'location1', label: 'Label with spaces' },
        { location: 'location2', label: 'SimpleLabel' },
        { location: 'location3', label: undefined },
    ]);
});

it('Should correctly parse blockLinks with multi-line labels', async () => {
    const text = `~> location1
This
Is
Label

~> location2 Single line label

~> location3
Multi line
Label here`;

    const parsed = await bitran.parser.parse(text);

    expect(
        parsed.children!.map((node) => (node as BlockLinkNode).parseData),
    ).toEqual([
        { location: 'location1', label: 'This\nIs\nLabel' },
        { location: 'location2', label: 'Single line label' },
        { location: 'location3', label: 'Multi line\nLabel here' },
    ]);

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text);
});

it('Should treat text that resembles blockLinks but violates structure as paragraphs', async () => {
    const text = `~NoSpaceBetween

~ > location label

~>

~location

Some text
~> location label

`;

    const paragraphs = (await bitran.parser.parse(text)).children!;

    for (const paragraph of paragraphs) {
        expect(paragraph).toBeInstanceOf(ParagraphNode);
    }
});
