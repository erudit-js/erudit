import { describe, expect, it } from 'vitest';
import { isolateProse, isRawElement, PROSE_REGISTRY } from '@jsprose/core';

import {
  Problems,
  problemsRegistryItem,
  problemsSchema,
  SubProblem,
  subProblemRegistryItem,
  subProblemSchema,
} from '@erudit-js/prose/elements/problem/problems';
import { asEruditRaw, resolveEruditRawElement } from '@erudit-js/prose';
import {
  ProblemDescription,
  problemDescriptionSchema,
} from '@erudit-js/prose/elements/problem/problemContent';
import { P, paragraphSchema } from '@erudit-js/prose/elements/paragraph/core';

import { prepareRegistry } from './problemContent.test';
import { problemScript } from './problem.test';

const _prepareRegistry = () => {
  prepareRegistry();
  PROSE_REGISTRY.addItem(subProblemRegistryItem);
  PROSE_REGISTRY.addItem(problemsRegistryItem);
};

describe('SubProblem', () => {
  it('should throw when script and children are both provided', () => {
    isolateProse(() => {
      _prepareRegistry();

      expect(() => (
        <SubProblem label="Foo Problem" script={{} as any}>
          <ProblemDescription>
            <P>Problem description</P>
          </ProblemDescription>
        </SubProblem>
      )).toThrow();
    });
  });

  it('should throw when problem content children are invalid', () => {
    isolateProse(() => {
      _prepareRegistry();

      expect(() => (
        <SubProblem>
          <P>Invalid child</P>
        </SubProblem>
      )).toThrow();
    });
  });

  it('should create problem with script correctly', () => {
    isolateProse(() => {
      _prepareRegistry();

      const scriptSubProblem = asEruditRaw(
        <SubProblem label="foo" script={problemScript()} />,
      );

      expect(isRawElement(scriptSubProblem, subProblemSchema)).toBe(true);
      expect(scriptSubProblem.data).toStrictEqual({
        label: 'foo',
        scriptUniques: {},
      });
    });
  });

  it('should create problem with children correctly', () => {
    isolateProse(() => {
      _prepareRegistry();

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
});

describe('Problems', () => {
  it('should throw when there are no sub problems', () => {
    isolateProse(() => {
      _prepareRegistry();

      expect(() => (
        <Problems title="Sample Problems" level="easy">
          <P>Invalid child</P>
        </Problems>
      )).toThrow();
    });
  });

  it('should create problems correctly', () => {
    isolateProse(() => {
      _prepareRegistry();

      const problems = asEruditRaw(
        <Problems
          title="Sample Problems"
          level="easy"
          snippet={{ search: true }}
        >
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
});

describe('problemScriptStep', () => {
  it('should allow only valid step types', async () => {
    await isolateProse(async () => {
      _prepareRegistry();

      const { problemScripts } = await resolveEruditRawElement({
        context: {
          language: 'en',
          linkable: true,
        },
        rawElement: (
          <>
            <Problems title="Sample Problems" level="easy">
              <SubProblem label="first">
                <ProblemDescription>First paragraph</ProblemDescription>
              </SubProblem>
              <SubProblem script={problemScript()} />
            </Problems>
          </>
        ),
      });

      expect(problemScripts).toEqual(new Set(['myScriptSrc/myScriptName']));
    });
  });
});
