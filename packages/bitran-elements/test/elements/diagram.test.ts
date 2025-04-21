import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    DiagramNode,
    diagramName,
    type DiagramParseData,
} from '../../src/elements/diagram/shared';
import { diagramTranspiler } from '../../src/elements/diagram/transpiler';

const bitran = defineBitranTranspiler({
    [diagramName]: diagramTranspiler,
});

it('Should correctly parse and stringify a simple diagram diagram', async () => {
    const text = `
@diagram
    flowchart LR
        Start --> Stop
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const diagramNode = parsed.children![0] as DiagramNode;
    expect(diagramNode).toBeInstanceOf(DiagramNode);

    const parseData = diagramNode.parseData as DiagramParseData;
    expect(parseData.content).toBeDefined();
    expect(parseData.content).toContain('flowchart LR');
    expect(parseData.content).toContain('Start --> Stop');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject empty diagram diagram', async () => {
    const text = `
@diagram
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should correctly parse and stringify a diagram diagram with caption', async () => {
    const text = `
@diagram
    caption: Sample Flowchart
    content: |
        flowchart LR
            A[Start] --> B{Decision}
            B -->|Yes| C[Process]
            B -->|No| D[End]
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const diagramNode = parsed.children![0] as DiagramNode;
    expect(diagramNode).toBeInstanceOf(DiagramNode);

    const parseData = diagramNode.parseData as DiagramParseData;
    expect(parseData.content).toBeDefined();
    expect(parseData.caption).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify a diagram diagram with detailed caption', async () => {
    const text = `
@diagram
    caption:
        main: System Architecture
        secondary: High-level overview of components
    content: |
        flowchart TB
            Frontend --> API
            API --> Database
            API --> ExternalService
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const diagramNode = parsed.children![0] as DiagramNode;
    expect(diagramNode).toBeInstanceOf(DiagramNode);

    const parseData = diagramNode.parseData as DiagramParseData;
    expect(parseData.content).toBeDefined();
    expect(parseData.caption).toBeDefined();

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject diagram diagram with caption missing main property', async () => {
    const text = `
@diagram
    caption:
        secondary: Missing main caption
    content: |
        flowchart LR
            A --> B
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should correctly parse and stringify complex diagram diagrams', async () => {
    const text = `
@diagram
    sequenceDiagram
        participant Alice
        participant Bob
        Alice->>John: Hello John, how are you?
        loop Healthcheck
            John->>John: Fight against hypochondria
        end
        Note right of John: Rational thoughts <br/>prevail!
        John-->>Alice: Great!
        John->>Bob: How about you?
        Bob-->>John: Jolly good!
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    const diagramNode = parsed.children![0] as DiagramNode;
    expect(diagramNode).toBeInstanceOf(DiagramNode);

    const parseData = diagramNode.parseData as DiagramParseData;
    expect(parseData.content).toBeDefined();
    expect(parseData.content).toContain('sequenceDiagram');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should handle different diagram diagram types', async () => {
    const text = `
@diagram
    classDiagram
        Class01 <|-- AveryLongClass : Cool
        Class03 *-- Class04
        Class05 o-- Class06
        Class07 .. Class08
        Class09 --> C2 : Where am i?
        Class09 --* C3
        Class09 --|> Class07
        Class07 : equals()
        Class07 : Object[] elementData
        Class01 : size()
        Class01 : int chimp
        Class01 : int gorilla
        Class08 <--> C2: Cool label
`;

    const parsed = await bitran.parser.parse(text);
    expect(parsed.children![0]).toBeInstanceOf(DiagramNode);

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});
