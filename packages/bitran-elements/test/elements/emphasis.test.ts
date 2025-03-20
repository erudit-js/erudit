import { InlinersNode, TextNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import { emphasisName, EmphasisNode } from '../../src/elements/emphasis/shared';
import { emphasisTranspiler } from '../../src/elements/emphasis/transpiler';

const bitran = defineBitranTranspiler({
    [emphasisName]: emphasisTranspiler,
});

it('Should correctly parse and stringify valid emphasis', async () => {
    const text = `This is *italic* and this is **bold**.`;
    const emphasisInliners = await bitran.parser.parseInliners(text);

    // Check that we have 5 root inliners: text, italic emphasis, text, bold emphasis, text
    expect(emphasisInliners.length).toBe(5);

    // Check italic emphasis
    const italicNode = emphasisInliners[1]! as EmphasisNode;
    expect(italicNode).toBeInstanceOf(EmphasisNode);
    expect(italicNode.parseData.type).toBe('italic');
    expect(italicNode.parseData.inliners).toBeInstanceOf(InlinersNode);
    // Check text inside italic emphasis
    const italicText = italicNode.parseData.inliners.children![0] as TextNode;
    expect(italicText).toBeInstanceOf(TextNode);
    expect(italicText.parseData).toBe('italic');

    // Check bold emphasis
    const boldNode = emphasisInliners[3]! as EmphasisNode;
    expect(boldNode).toBeInstanceOf(EmphasisNode);
    expect(boldNode.parseData.type).toBe('bold');
    expect(boldNode.parseData.inliners).toBeInstanceOf(InlinersNode);
    // Check text inside bold emphasis
    const boldText = boldNode.parseData.inliners.children![0] as TextNode;
    expect(boldText).toBeInstanceOf(TextNode);
    expect(boldText.parseData).toBe('bold');

    // Check stringification
    const inlinersNode = new InlinersNode(undefined);
    inlinersNode.setNodes(emphasisInliners);
    expect(await bitran.stringifier.stringify(inlinersNode)).toBe(text);
});

it('Should correctly parse and stringify emphasis with meta', async () => {
    const text = `This is *italic*{ #id .class } and this is **bold**{ +toc }.`;
    const emphasisInliners = await bitran.parser.parseInliners(text);

    // Check stringification
    const inlinersNode = new InlinersNode(undefined);
    inlinersNode.setNodes(emphasisInliners);
    expect(await bitran.stringifier.stringify(inlinersNode)).toBe(text);
});
