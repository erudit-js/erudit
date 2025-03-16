import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    AccentNode,
    type AccentComplexParseData,
    type AccentSimpleParseData,
} from '../../src/elements/accent/shared';
import { defineAccentTranspiler } from '../../src/elements/accent/transpiler';

const accentName = 'note';

const bitran = defineBitranTranspiler({
    [accentName]: defineAccentTranspiler({
        objName: accentName,
    }),
});

it('Should correctly parse and stringify simple accents', async () => {
    const text = `
@note
    title: Simple Accent
    main: |
        This is a simple accent content.
        It can have multiple lines.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const accentNode = parsed.children![0] as AccentNode;
    expect(accentNode).toBeInstanceOf(AccentNode);

    const parseData = accentNode.parseData as AccentSimpleParseData;
    expect(parseData.type).toBe('simple');
    expect(parseData.title).toBe('Simple Accent');
    expect(parseData.objName).toBe('note');
    expect(parseData.main).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify complex accents with sections', async () => {
    const text = `
@note
    title: Complex Accent
    direction: row
    sections:
        first: |
            First section content.

            Multiline support.
        second: |
            Second section content.

            Multiline support.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const accentNode = parsed.children![0] as AccentNode;
    expect(accentNode).toBeInstanceOf(AccentNode);

    const parseData = accentNode.parseData as AccentComplexParseData;
    expect(parseData.type).toBe('complex');
    expect(parseData.title).toBe('Complex Accent');
    expect(parseData.objName).toBe('note');
    expect(parseData.direction).toBe('row');
    expect(parseData.sections).toBeDefined();
    expect(parseData.sections.length).toBe(2);

    // Check section ids
    const sectionIds = parseData.sections.map((s) => s.id);
    expect(sectionIds).toContain('first');
    expect(sectionIds).toContain('second');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify complex accents with main and sections', async () => {
    const text = `
@note
    title: Complex Accent With Main
    main: |
        This is the main content.

        Multiline support.
    direction: column
    sections:
        first: |
            First section content.

            Multiline support.
        second: |
            Second section content.

            Multiline support.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const accentNode = parsed.children![0] as AccentNode;
    expect(accentNode).toBeInstanceOf(AccentNode);

    const parseData = accentNode.parseData as AccentComplexParseData;
    expect(parseData.type).toBe('complex');
    expect(parseData.title).toBe('Complex Accent With Main');
    expect(parseData.objName).toBe('note');
    expect(parseData.main).toBeDefined();
    expect(parseData.direction).toBe('column');
    expect(parseData.sections).toBeDefined();
    expect(parseData.sections.length).toBe(2);

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject accents with neither main nor sections', async () => {
    const text = `
@note
    title: Invalid Accent
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject accents with empty main', async () => {
    const text = `
@note
    main: ""
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject accents with empty sections', async () => {
    const text = `
@note
    sections: {}
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject accents with invalid direction', async () => {
    const text = `
@note
    direction: diagonal
    sections:
        first: Some content
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject accents with non-string section content', async () => {
    const text = `
@note
    sections:
        first: 123
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject accents with empty section content', async () => {
    const text = `
@note
    sections:
        first: ""
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
