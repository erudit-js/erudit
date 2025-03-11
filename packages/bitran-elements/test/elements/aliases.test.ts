import { BlockErrorNode, ParagraphNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    aliasesName,
    type AliasesNode,
    NO_ALIASES,
    tryReplaceAlias,
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

it('Should return empty object when no aliases are defined', async () => {
    expect(NO_ALIASES()).toEqual({});
});

describe('tryReplaceAlias', () => {
    const aliases = {
        a1: 'foo',
        a2: 'bar',
        a3: 'baz',
    };

    const replaceTargets = ['~a1', '~a2', '~a3'];

    const noTouchTargets = [
        'foo|bar|baz',
        'https://www.google.com',
        '~',
        ' ~a1',
        '~ a1',
        '~a1 ',
        '~a1 a2',
    ];

    const throwTargets = ['~a4'];

    for (const target of replaceTargets) {
        // @ts-ignore
        const replaceValue = aliases[target.substring(1)];

        it(`should replace target "${target}" with "${replaceValue}"`, () => {
            expect(tryReplaceAlias(target, aliases)).toBe(replaceValue);
        });
    }

    it.each(noTouchTargets)('should not change target "%s"', (target) => {
        expect(tryReplaceAlias(target, aliases)).toBe(target);
    });

    it.each(throwTargets)('should throw on target "%s"', (target) => {
        expect(() => tryReplaceAlias(target, aliases)).toThrow();
    });
});
