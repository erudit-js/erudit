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

it('Should correctly parse and stringify nested bold in italic', async () => {
    const text = `*I **love** you*`;
    const emphasisInliners = await bitran.parser.parseInliners(text);

    // Should have 1 italic node
    expect(emphasisInliners.length).toBe(1);

    const italicNode = emphasisInliners[0]! as EmphasisNode;
    expect(italicNode).toBeInstanceOf(EmphasisNode);
    expect(italicNode.parseData.type).toBe('italic');

    // The italic node should have 3 children: "I ", bold("love"), " you"
    const italicInliners = italicNode.parseData.inliners.children!;
    expect(italicInliners.length).toBe(3);

    // Check bold node inside italic
    const boldNode = italicInliners[1]! as EmphasisNode;
    expect(boldNode).toBeInstanceOf(EmphasisNode);
    expect(boldNode.parseData.type).toBe('bold');

    // Check stringification
    const inlinersNode = new InlinersNode(undefined);
    inlinersNode.setNodes(emphasisInliners);
    expect(await bitran.stringifier.stringify(inlinersNode)).toBe(text);
});

it('Should correctly parse and stringify bold and italic together (***test***)', async () => {
    const text = `***test***`;
    const emphasisInliners = await bitran.parser.parseInliners(text);

    // Should parse as a bold node with an italic node inside or vice versa
    expect(emphasisInliners.length).toBe(1);

    // Check outer node
    const outerNode = emphasisInliners[0]! as EmphasisNode;
    expect(outerNode).toBeInstanceOf(EmphasisNode);

    // Check inner node
    const innerInliners = outerNode.parseData.inliners.children!;
    expect(innerInliners.length).toBe(1);
    expect(innerInliners[0]).toBeInstanceOf(EmphasisNode);

    // Verify we can stringify back to the original
    const inlinersNode = new InlinersNode(undefined);
    inlinersNode.setNodes(emphasisInliners);
    expect(await bitran.stringifier.stringify(inlinersNode)).toBe(text);
});
