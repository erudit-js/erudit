import { describe, expect, it } from 'vitest';
import { defineUnique, isRawElement } from 'tsprose';

import { P } from '@src/elements/paragraph/core';
import {
  Problem,
  problemSchema,
  type ProblemSchema,
} from '@src/elements/problem/problem';
import {
  problemAnswer,
  ProblemDescription,
  problemDescriptionSchema,
} from '@src/elements/problem/problemContent';
import { defineProblemScript } from '@src/elements/problem/problemScript';

import { asEruditRaw } from '@src/rawElement';

import { ProblemAnswer } from './problemContent.test';

export const problemScript = defineProblemScript('myScriptSrc/myScriptName', {
  isGenerator: false,
})(() => (
  <>
    <ProblemDescription>Hello World!</ProblemDescription>
    <ProblemAnswer>
      <P>This is my answer!</P>
    </ProblemAnswer>
  </>
));

describe('Problem', () => {
  it('should throw when script and children are both provided', () => {
    expect(() => (
      <Problem title="Foo Problem" level="hard" script={{} as any}>
        <ProblemDescription>
          <P>Problem description</P>
        </ProblemDescription>
      </Problem>
    )).toThrow();
  });

  it('should throw when problem content children are invalid', () => {
    expect(() => (
      <Problem title="Invalid Problem" level="medium">
        <P>Invalid child</P>
      </Problem>
    )).toThrow();
  });

  it('should create problem with script correctly', () => {
    const scriptProblem = asEruditRaw<ProblemSchema>(
      <Problem
        title="Script Problem"
        level="example"
        applied
        snippet={{ search: true }}
        script={problemScript()}
      />,
    );

    expect(isRawElement(scriptProblem, problemSchema)).toBe(true);
    expect(scriptProblem.children!.length).toBe(2);
    expect(
      isRawElement(scriptProblem.children![0], problemDescriptionSchema),
    ).toBe(true);
    expect(isRawElement(scriptProblem.children![1], problemAnswer.schema)).toBe(
      true,
    );
    expect(scriptProblem.data.info).toStrictEqual({
      title: 'Script Problem',
      level: 'example',
      attributes: ['applied'],
    });
    expect(scriptProblem.title).toBe('Script Problem');
    expect(scriptProblem.snippet).toEqual({
      title: 'Script Problem',
      search: true,
      seo: true,
    });
  });

  it('should store script uniques in problem data', () => {
    const pUnique = defineUnique({
      documentId: 'docId',
      name: 'testUnique',
      tag: P,
    });

    const problemScript = defineProblemScript('script-id', {
      uniques: {
        myP: P,
      },
    })(({ uniques }) => {
      return (
        <>
          <ProblemDescription>
            <P $={uniques.myP}>This is paragraph</P>
          </ProblemDescription>
        </>
      );
    });

    const scriptProblem = asEruditRaw(
      <Problem
        title="Script Problem with Uniques"
        level="example"
        script={problemScript({
          myP: pUnique,
        })}
      />,
    );

    expect(scriptProblem.data.scriptUniques!['myP']).toBe(pUnique);
  });

  it('should create problem with children correctly', () => {
    const childProblem = asEruditRaw(
      <Problem title="Child Problem" level="easy" snippet={{ search: true }}>
        <ProblemDescription>
          <P>Problem description</P>
        </ProblemDescription>
      </Problem>,
    );

    expect(isRawElement(childProblem, problemSchema)).toBe(true);
    expect(childProblem.data.info).toStrictEqual({
      title: 'Child Problem',
      level: 'easy',
      attributes: [],
    });
    expect(childProblem.children!.length).toBe(1);
    expect(
      isRawElement(childProblem.children![0], problemDescriptionSchema),
    ).toBe(true);
    expect(childProblem.title).toBe('Child Problem');
    expect(childProblem.snippet).toEqual({
      title: 'Child Problem',
      search: true,
      seo: true,
    });
  });
});
