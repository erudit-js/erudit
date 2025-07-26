import { BlockErrorNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import { ProblemNode, problemName } from '../../../src/elements/problem/shared';
import { problemTranspiler } from '../../../src/elements/problem/transpiler';

const bitran = defineBitranTranspiler({
    [problemName]: problemTranspiler,
});

it('Should correctly parse and stringify a minimal problem element', async () => {
    const text = `
@problem
    title: First problem
    level: easy
    description: This is the problem description.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the problem element
    const problem = parsed.children![0] as ProblemNode;
    expect(problem).toBeInstanceOf(ProblemNode);
    expect(problem.parseData.info.title).toBe('First problem');
    expect(problem.parseData.info.level).toBe('easy');
    expect(problem.parseData.description).toBeDefined();
    expect(problem.parseData.description.source).toContain(
        'This is the problem description.',
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify a problem with all properties', async () => {
    const text = `
@problem
    title: Complete problem
    level: medium
    attributes:
        - pretty
        - applied
    generator: path/to/generator.ts
    description: This is the problem description.
    hints:
        - This is hint 1
        - This is hint 2
    solution:
        "": This is the default solution.
        Alternative: This is an alternative solution.
    answer: The answer is 42.
    note: This is an additional note.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the problem element
    const problem = parsed.children![0] as ProblemNode;
    expect(problem).toBeInstanceOf(ProblemNode);
    expect(problem.parseData.info.title).toBe('Complete problem');
    expect(problem.parseData.info.level).toBe('medium');
    expect(problem.parseData.info.attributes).toEqual(['pretty', 'applied']);
    expect(problem.parseData.generatorSrc).toBe('path/to/generator.ts');

    // Check description
    expect(problem.parseData.description).toBeDefined();
    expect(problem.parseData.description.source).toContain(
        'This is the problem description.',
    );

    // Check hints
    expect(problem.parseData.hints).toBeDefined();
    expect(problem.parseData.hints!.length).toBe(2);
    expect(problem.parseData.hints![0]!.source).toBe('This is hint 1');
    expect(problem.parseData.hints![1]!.source).toBe('This is hint 2');

    // Check solutions
    expect(problem.parseData.solution).toBeDefined();
    expect(problem.parseData.solution!['']!.source).toBe(
        'This is the default solution.',
    );
    expect(problem.parseData.solution!['Alternative']!.source).toBe(
        'This is an alternative solution.',
    );

    // Check answer
    expect(problem.parseData.answer).toBeDefined();
    expect(problem.parseData.answer!.source).toBe('The answer is 42.');

    // Check note
    expect(problem.parseData.note).toBeDefined();
    expect(problem.parseData.note!.source).toBe('This is an additional note.');

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse a problem with string solution', async () => {
    const text = `
@problem
    title: Problem with string solution
    level: easy
    description: This is the problem description.
    solution: This is a simple solution.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the problem element
    const problem = parsed.children![0] as ProblemNode;
    expect(problem).toBeInstanceOf(ProblemNode);

    // Check solution
    expect(problem.parseData.solution).toBeDefined();
    expect(problem.parseData.solution!['']!.source).toBe(
        'This is a simple solution.',
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse a problem with hint property', async () => {
    const text = `
@problem
    title: Problem with hint property
    level: easy
    description: This is the problem description.
    hint: This is a single hint.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the problem element
    const problem = parsed.children![0] as ProblemNode;
    expect(problem).toBeInstanceOf(ProblemNode);

    // Check hint converted to hints array
    expect(problem.parseData.hints).toBeDefined();
    expect(problem.parseData.hints!.length).toBe(1);
    expect(problem.parseData.hints![0]!.source).toBe('This is a single hint.');

    // Check stringification uses hint property for single hints
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject problem element with both hint and hints properties', async () => {
    const text = `
@problem
    title: Problem with both hint and hints
    level: easy
    description: This is the problem description.
    hint: This is a single hint.
    hints:
        - This is another hint
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problem element without title', async () => {
    const text = `
@problem
    level: easy
    description: |
        This is the problem description.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problem element without level', async () => {
    const text = `
@problem
    title: Problem without level
    description: |
        This is the problem description.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problem element with invalid level', async () => {
    const text = `
@problem
    title: Problem with invalid level
    level: invalid-level
    description: |
        This is the problem description.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problem element without description', async () => {
    const text = `
@problem
    title: Problem without description
    level: easy
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problem element with invalid attributes', async () => {
    const text = `
@problem
    title: Problem with invalid attributes
    level: easy
    attributes: [invalid, pretty]
    description: |
        This is the problem description.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problem element with non-array attributes', async () => {
    const text = `
@problem
    title: Problem with non-array attributes
    level: easy
    attributes: not-an-array
    description: |
        This is the problem description.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problem element with non-array hints', async () => {
    const text = `
@problem
    title: Problem with non-array hints
    level: easy
    description: |
        This is the problem description.
    hints: not-an-array
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problem element with invalid hint', async () => {
    const text = `
@problem
    title: Problem with invalid hint
    level: easy
    description: |
        This is the problem description.
    hints: [
        "",
        "This is a valid hint"
    ]
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
