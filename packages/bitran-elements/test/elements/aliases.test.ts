import { BlockErrorNode, ParagraphNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    aliasesName,
    type AliasesNode,
} from '../../src/elements/aliases/shared';
import { aliasesTranspiler } from '../../src/elements/aliases/transpiler';

const bitran = defineBitranTranspiler({
    [aliasesName]: aliasesTranspiler,
});

it('Should correctly parse and stringify valid aliases', async () => {
    const text = `~ foo article|foo|bar

~ bar article|foo|bar
~ baz article|foo|bar`;

    const parsed = await bitran.parser.parse(text);

    expect(
        parsed.children!.map((node) => (node as AliasesNode).parseData),
    ).toEqual([
        { foo: 'article|foo|bar' },
        {
            bar: 'article|foo|bar',
            baz: 'article|foo|bar',
        },
    ]);

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text);
});

it('Should treat text that resembles aliases but violates structure as paragraphs', async () => {
    const text = `~ NoSpaceBetween

~ foo targetFoo
~ NoSpaceBetween

~ NoSpaceBetween
~ foo targetFoo

Some text
~ foo targetFoo

~foo

~ foo targetFoo
Some text

`;

    const paragraphs = (await bitran.parser.parse(text)).children!;

    for (const paragraph of paragraphs) {
        expect(paragraph).toBeInstanceOf(ParagraphNode);
    }
});

it('Should create error duplicate aliases', async () => {
    const text = `~ foo target1
~ foo target2`;

    const parsed = await bitran.parser.parse(text);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
