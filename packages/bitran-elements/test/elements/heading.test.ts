import { BlockErrorNode, ParagraphNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    headingName,
    type HeadingNode,
} from '../../src/elements/heading/shared';
import {
    headingTranspiler,
    defineHeadingTranspiler,
} from '../../src/elements/heading/transpiler';

const bitran = defineBitranTranspiler({
    [headingName]: headingTranspiler,
});

it('Should correctly parse and stringify valid headings', async () => {
    const text = `
# Hello!

## This is me.

### All this is valid, event "with $special$ characters"!
`;

    const parsed = await bitran.parser.parse(text);

    expect(
        parsed.children!.map((node) => (node as HeadingNode).parseData),
    ).toEqual([
        { level: 1, title: 'Hello!' },
        { level: 2, title: 'This is me.' },
        {
            level: 3,
            title: 'All this is valid, event "with $special$ characters"!',
        },
    ]);

    expect(await bitran.stringifier.stringify(parsed)).toEqual(text.trim());
});

it('Should reject headings with invalid levels', async () => {
    const text = `

#### Foobar

    `.trim();

    const headings = (await bitran.parser.parse(text)).children!;

    for (const heading of headings) {
        expect(heading).toBeInstanceOf(BlockErrorNode);
    }
});

it('Should treat text that resembles headings but violates structure as paragraphs', async () => {
    const text = `
#

###

# Some
text

Some
# text
`;

    const paragraphs = (await bitran.parser.parse(text)).children!;

    for (const paragraph of paragraphs) {
        expect(paragraph).toBeInstanceOf(ParagraphNode);
    }
});

it('Should strip special characters from IDs', async () => {
    const text = `
# 100$ is a lot!#$%^&*()+<>?:"{}|~\`=[]\\;',./
    `.trim();

    const heading = (await bitran.parser.parse(text))
        .children![0] as HeadingNode;
    expect(heading.autoId).toBe('100-is-a-lot');
});

it('Should trim ID and replace spaces with dashes', async () => {
    const text = `
        #     A      lot     of          spaces
    `.trim();

    const heading = (await bitran.parser.parse(text))
        .children![0] as HeadingNode;

    expect(heading.autoId).toBe('a-lot-of-spaces');
});

it('Should not touch letters of different language in default locale', async () => {
    const text = `
# Это мой заголовок
    `.trim();

    const heading = (await bitran.parser.parse(text))
        .children![0] as HeadingNode;

    expect(heading.autoId).toBe('это-мой-заголовок');
});

it('Should apply language-specific slugify', async () => {
    const text = `
# Это мой заголовок
    `.trim();

    const localeBitran = defineBitranTranspiler({
        [headingName]: defineHeadingTranspiler({
            language: 'ru',
        }),
    });

    const heading = (await localeBitran.parser.parse(text))
        .children![0] as HeadingNode;

    expect(heading.autoId).toBe('eto-moy-zagolovok');
});
