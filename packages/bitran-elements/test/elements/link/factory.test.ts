import { InlinersNode, TextNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import { linkName, LinkNode } from '../../../src/elements/link/shared';
import { linkTranspiler } from '../../../src/elements/link/transpiler';

const bitran = defineBitranTranspiler({
    [linkName]: linkTranspiler,
});

it('Should correctly parse and stringify valid links', async () => {
    const text = `This is a [link](https://example.com) to a website.`;
    const linkInliners = await bitran.parser.parseInliners(text);

    // Check that we have 3 root inliners: text, link, text
    expect(linkInliners.length).toBe(3);

    // Check link node
    const linkNode = linkInliners[1]! as LinkNode;
    expect(linkNode).toBeInstanceOf(LinkNode);
    expect(linkNode.parseData.label).toBe('link');
    expect(linkNode.parseData.target).toBe('https://example.com');

    // Check stringification
    const inlinersNode = new InlinersNode(undefined);
    inlinersNode.setNodes(linkInliners);
    expect(await bitran.stringifier.stringify(inlinersNode)).toBe(text);
});

it('Should correctly parse links with escaped special characters', async () => {
    const text = `This is a [link with \\$ and \\[ and \\]](https://example.com) to a website.`;
    const linkInliners = await bitran.parser.parseInliners(text);

    // Check link node
    const linkNode = linkInliners[1]! as LinkNode;
    expect(linkNode).toBeInstanceOf(LinkNode);
    // Verify that escaped characters were unescaped
    expect(linkNode.parseData.label).toBe('link with $ and [ and ]');
    expect(linkNode.parseData.target).toBe('https://example.com');

    // Check stringification
    const inlinersNode = new InlinersNode(undefined);
    inlinersNode.setNodes(linkInliners);
    // Now stringifier should escape prohibited symbols
    expect(await bitran.stringifier.stringify(inlinersNode)).toBe(
        `This is a [link with \\$ and \\[ and \\]](https://example.com) to a website.`,
    );
});

it('Should not match links with unescaped special characters', async () => {
    const text = `This is not a [link$with$special$chars](example.com) but [regular](example.com) works.`;
    const linkInliners = await bitran.parser.parseInliners(text);

    // The first "link" shouldn't be parsed as a link node
    expect(linkInliners[0]).toBeInstanceOf(TextNode);

    // But we should have a link node for the second link
    // The position may vary based on how the text is split
    const linkNode = linkInliners.find(
        (node) => node instanceof LinkNode,
    ) as LinkNode;
    expect(linkNode).toBeDefined();
    expect(linkNode.parseData.label).toBe('regular');
});

it('Should only parse valid links in complex examples', async () => {
    const text = `[формализм]$@[aadsf](sdf)`;
    const linkInliners = await bitran.parser.parseInliners(text);

    // Should have text node and link node
    expect(linkInliners.length).toBe(2);

    // First should be text containing "[формализм]$@"
    expect(linkInliners[0]).toBeInstanceOf(TextNode);
    expect((linkInliners[0] as TextNode).parseData).toBe('[формализм]$@');

    // Second should be link with label "aadsf"
    const linkNode = linkInliners[1] as LinkNode;
    expect(linkNode).toBeInstanceOf(LinkNode);
    expect(linkNode.parseData.label).toBe('aadsf');
    expect(linkNode.parseData.target).toBe('sdf');
});

it('Should handle escaped characters correctly when stringifying', async () => {
    // Create a link node with special characters in the label
    const linkNode = new LinkNode();
    linkNode.name = linkName;
    linkNode.parseData = {
        label: 'test $ [ ]',
        target: 'example.com',
    };

    // When we stringify it, special chars should be escaped
    const inlinersNode = new InlinersNode(undefined);
    inlinersNode.setNodes([linkNode]);
    expect(await bitran.stringifier.stringify(inlinersNode)).toBe(
        '[test \\$ \\[ \\]](example.com)',
    );
});
