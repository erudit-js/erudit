import { BlockErrorNode, BlocksNode } from '@bitran-js/core';
import { defineBitranTranspiler } from '@bitran-js/transpiler';

import {
    ProblemsNode,
    problemsName,
} from '../../../src/elements/problem/shared';
import { problemsTranspiler } from '../../../src/elements/problem/transpiler';

const bitran = defineBitranTranspiler({
    [problemsName]: problemsTranspiler,
});

it('Should correctly parse and stringify a minimal problems set element', async () => {
    const text = `
@problems
    title: Problem Set 1
    level: easy
    set:
        - description: |
              This is the first problem.
        - description: |
              This is the second problem.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the problems element
    const problems = parsed.children![0] as ProblemsNode;
    expect(problems).toBeInstanceOf(ProblemsNode);
    expect(problems.parseData.info.title).toBe('Problem Set 1');
    expect(problems.parseData.info.level).toBe('easy');

    // Check the set
    expect(problems.parseData.set).toBeDefined();
    expect(problems.parseData.set.length).toBe(2);
    expect(problems.parseData.set[0]!.description.source).toContain(
        'This is the first problem.',
    );
    expect(problems.parseData.set[1]!.description.source).toContain(
        'This is the second problem.',
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify a problems set with shared content', async () => {
    const text = `
@problems
    title: Problem Set with shared
    level: medium
    attributes:
        - pretty
    shared: |
        This is shared content for all problems.

        Really is.
    set:
        - description: |
              First problem description.
          answer: |
              First answer.
        - description: |
              Second problem description.
          hints:
              - Hint for the second problem
              - Second hint
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the problems element
    const problems = parsed.children![0] as ProblemsNode;
    expect(problems).toBeInstanceOf(ProblemsNode);
    expect(problems.parseData.info.title).toBe('Problem Set with shared');
    expect(problems.parseData.info.level).toBe('medium');
    expect(problems.parseData.info.attributes).toEqual(['pretty']);

    // Check shared content
    expect(problems.parseData.shared).toBeInstanceOf(BlocksNode);

    // Check the set
    expect(problems.parseData.set).toBeDefined();
    expect(problems.parseData.set.length).toBe(2);

    // Check first problem
    expect(problems.parseData.set[0]!.description.source).toContain(
        'First problem description.',
    );
    expect(problems.parseData.set[0]!.answer).toBeDefined();
    expect(problems.parseData.set[0]!.answer!.source).toBe('First answer.\n');

    // Check second problem
    expect(problems.parseData.set[1]!.description.source).toContain(
        'Second problem description.\n',
    );
    expect(problems.parseData.set[1]!.hints).toBeDefined();
    expect(problems.parseData.set[1]!.hints!.length).toBe(2);
    expect(problems.parseData.set[1]!.hints![0]!.source).toBe(
        'Hint for the second problem',
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify a problems set with complex content', async () => {
    const text = `
@problems
    title: Advanced Problems
    level: hard
    attributes:
        - applied
    set:
        - generator: path/to/generator.ts
          description: |
              First complex problem.
          hints:
              - Hint 1
              - Hint 2
          solution:
              Method 1: |
                  Solution using first method.
              Method 2: |
                  Solution using second method.
          answer: |
              The answer is 42.
          note: |
              Additional note about this problem.
        - generator: path/to/generator.ts
          description: |
              Second complex problem.
          solution: |
              Single solution approach.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the problems element
    const problems = parsed.children![0] as ProblemsNode;
    expect(problems).toBeInstanceOf(ProblemsNode);
    expect(problems.parseData.info.title).toBe('Advanced Problems');
    expect(problems.parseData.info.level).toBe('hard');
    expect(problems.parseData.info.attributes).toEqual(['applied']);

    // Check the problems
    expect(problems.parseData.set).toBeDefined();
    expect(problems.parseData.set.length).toBe(2);

    // Check first problem
    const firstProblem = problems.parseData.set[0]!;
    expect(firstProblem.description.source).toContain('First complex problem.');
    expect(firstProblem.hints!.length).toBe(2);
    expect(firstProblem.solution).toBeDefined();
    expect(firstProblem.solution!['Method 1']!.source).toBe(
        'Solution using first method.\n',
    );
    expect(firstProblem.solution!['Method 2']!.source).toBe(
        'Solution using second method.\n',
    );
    expect(firstProblem.answer!.source).toBe('The answer is 42.\n');
    expect(firstProblem.note!.source).toBe(
        'Additional note about this problem.\n',
    );

    // Check second problem
    const secondProblem = problems.parseData.set[1]!;
    expect(secondProblem.description.source).toContain(
        'Second complex problem.',
    );
    expect(secondProblem.generatorSrc).toBe('path/to/generator.ts');
    expect(secondProblem.solution).toBeDefined();
    expect(secondProblem.solution!['']!.source).toBe(
        'Single solution approach.\n',
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should correctly parse and stringify problems with labels', async () => {
    const text = `
@problems
    title: Labeled Problems
    level: medium
    set:
        - label: Problem A
          description: |
              This is problem A.
        - label: Problem B
          description: |
              This is problem B.
          hint: |
              Here's a hint for problem B.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);

    // Check the problems element
    const problems = parsed.children![0] as ProblemsNode;
    expect(problems).toBeInstanceOf(ProblemsNode);

    // Check the problems have correct labels
    expect(problems.parseData.set).toBeDefined();
    expect(problems.parseData.set.length).toBe(2);
    expect(problems.parseData.set[0]!.label).toBe('Problem A');
    expect(problems.parseData.set[0]!.description.source).toContain(
        'This is problem A.',
    );
    expect(problems.parseData.set[1]!.label).toBe('Problem B');
    expect(problems.parseData.set[1]!.description.source).toContain(
        'This is problem B.',
    );
    expect(problems.parseData.set[1]!.hints![0]!.source).toBe(
        "Here's a hint for problem B.\n",
    );

    // Check stringification
    const stringified = await bitran.stringifier.stringify(parsed);
    expect(stringified).toEqual(text.trim());
});

it('Should reject problems element without info', async () => {
    const text = `
@problems
    set:
        - description: |
              This is a problem.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problems element with invalid info', async () => {
    const text = `
@problems
    title: Invalid Set
    set:
        - description: |
              This is a problem.
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problems element without set property', async () => {
    const text = `
@problems
    title: Set without problems
    level: easy
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problems element with non-array set property', async () => {
    const text = `
@problems
    title: Set with non-array
    level: easy
    set: not-an-array
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problems element with invalid problem in set', async () => {
    const text = `
@problems
    title: Set with invalid problem
    level: easy
    set:
        - description: |
              This is a valid problem.
        - // Missing description
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});

it('Should reject problems element with empty set', async () => {
    const text = `
@problems
    title: Empty Problem Set
    level: easy
    set: []
`;

    const parsed = await bitran.parser.parse(text);

    expect(parsed.children).toBeDefined();
    expect(parsed.children!.length).toBe(1);
    expect(parsed.children![0]).toBeInstanceOf(BlockErrorNode);
});
