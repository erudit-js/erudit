import { describe, expect, it } from 'vitest';
import { isRawElement } from 'tsprose';

import {
  Problems,
  problemsSchema,
  SubProblem,
  subProblemSchema,
  type SubProblemSchema,
} from '@src/elements/problem/problems';
import {
  ProblemDescription,
  problemDescriptionSchema,
} from '@src/elements/problem/problemContent';
import { P, paragraphSchema } from '@src/elements/paragraph/core';

import { problemScript } from './problem.test';
import { asEruditRaw } from '@src/rawElement';

describe('SubProblem', () => {
  it('should throw when script and children are both provided', () => {
    expect(() => (
      <SubProblem label="Foo Problem" script={{} as any}>
        <ProblemDescription>
          <P>Problem description</P>
        </ProblemDescription>
      </SubProblem>
    )).toThrow();
  });

  it('should throw when problem content children are invalid', () => {
    expect(() => (
      <SubProblem>
        <P>Invalid child</P>
      </SubProblem>
    )).toThrow();
  });

  it('should create problem with script correctly', () => {
    const scriptSubProblem = asEruditRaw<SubProblemSchema>(
      <SubProblem label="foo" script={problemScript()} />,
    );

    expect(isRawElement(scriptSubProblem, subProblemSchema)).toBe(true);
    expect(scriptSubProblem.data).toStrictEqual({
      label: 'foo',
      scriptUniques: {},
    });
  });

  it('should create problem with children correctly', () => {
    const childProblem = asEruditRaw(
      <SubProblem>
        <ProblemDescription>Problem description</ProblemDescription>
      </SubProblem>,
    );

    expect(isRawElement(childProblem, subProblemSchema)).toBe(true);
    expect(childProblem.data).toStrictEqual({});
    expect(childProblem.children!.length).toBe(1);
    expect(
      isRawElement(childProblem.children![0], problemDescriptionSchema),
    ).toBe(true);
  });
});

describe('Problems', () => {
  it('should throw when there are no sub problems', () => {
    expect(() => (
      <Problems title="Sample Problems" level="easy">
        <P>Invalid child</P>
      </Problems>
    )).toThrow();
  });

  it('should create problems correctly', () => {
    const problems = asEruditRaw(
      <Problems title="Sample Problems" level="easy" snippet={{ search: true }}>
        <P>Paragraph 1</P>
        <SubProblem label="first">
          <ProblemDescription>
            <P>First paragraph</P>
            <P>Second paragraph</P>
          </ProblemDescription>
        </SubProblem>
        <SubProblem script={problemScript()} />
      </Problems>,
    );

    expect(isRawElement(problems, problemsSchema)).toBe(true);
    expect(problems.data).toStrictEqual({
      title: 'Sample Problems',
      level: 'easy',
      attributes: [],
    });
    expect(problems.children!.length).toBe(3);
    expect(isRawElement(problems.children![0], paragraphSchema)).toBe(true);
    expect(isRawElement(problems.children![1], subProblemSchema)).toBe(true);
    expect(isRawElement(problems.children![2], subProblemSchema)).toBe(true);
    expect(problems.title).toBe('Sample Problems');
    expect(problems.snippet).toEqual({
      title: 'Sample Problems',
      search: true,
      seo: true,
    });
  });
});
