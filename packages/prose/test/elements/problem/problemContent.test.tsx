import { describe, expect, it } from 'vitest';
import {
  isolateProse,
  isRawElement,
  PROSE_REGISTRY,
  ProseError,
} from '@jsprose/core';

import { asEruditRaw } from '@erudit-js/prose';
import {
  P,
  paragraphRegistryItem,
  paragraphSchema,
} from '@erudit-js/prose/elements/paragraph/core';
import {
  problemDescriptionRegistryItem,
  problemHintRegistryItem,
  problemAnswer,
  problemSolution,
  problemNote,
  problemCheckRegistryItem,
  ProblemDescription,
  problemDescriptionSchema,
  ProblemHint,
  problemHintSchema,
  ProblemSection,
  problemSectionRegistryItem,
  problemSectionSchema,
  ProblemCheck,
  problemCheckSchema,
  validateProblemContent,
  checkValue,
} from '@erudit-js/prose/elements/problem/problemContent';

export const prepareRegistry = () =>
  PROSE_REGISTRY.setItems(
    problemDescriptionRegistryItem,
    problemHintRegistryItem,
    problemAnswer.registryItem,
    problemSolution.registryItem,
    problemNote.registryItem,
    problemCheckRegistryItem,
    problemSectionRegistryItem,
    //
    paragraphRegistryItem,
  );

export const ProblemAnswer = problemAnswer.tag;

describe('Problem Description', () => {
  it('should create description correctly', () => {
    isolateProse(() => {
      prepareRegistry();

      const description = asEruditRaw(
        <ProblemDescription>
          <P>First paragraph</P>
        </ProblemDescription>,
      );

      expect(isRawElement(description, problemDescriptionSchema)).toBe(true);
      expect(description.children).toHaveLength(1);
    });
  });
});

describe('Problem Hint', () => {
  it('should create hint correctly', () => {
    isolateProse(() => {
      prepareRegistry();

      const hint = asEruditRaw(
        <ProblemHint>
          <P>First paragraph</P>
        </ProblemHint>,
      );

      expect(isRawElement(hint, problemHintSchema)).toBe(true);
      expect(hint.children).toHaveLength(1);
    });
  });
});

describe('Problem Section Container: Answer/Solution/Note', () => {
  it('should throw when section title is empty', () => {
    isolateProse(() => {
      prepareRegistry();

      expect(() => (
        <ProblemSection title="">
          <P>Section content</P>
        </ProblemSection>
      )).toThrow(ProseError);
    });
  });

  it('should throw when non-section child appears after section child', () => {
    isolateProse(() => {
      prepareRegistry();

      expect(() => (
        <ProblemAnswer>
          <ProblemSection title="section 1">
            <P>Section content</P>
          </ProblemSection>
          <P>Non section paragraph</P>
        </ProblemAnswer>
      )).toThrow(ProseError);
    });
  });

  it('should create problem section container correctly', () => {
    isolateProse(() => {
      prepareRegistry();

      const answer = asEruditRaw(
        <ProblemAnswer>
          <P>Non section paragraph</P>
          <ProblemSection title="answer section 1">
            <P>Answer section 1</P>
          </ProblemSection>
        </ProblemAnswer>,
      );

      expect(isRawElement(answer, problemAnswer.schema)).toBe(true);
      expect(answer.children).toHaveLength(2);

      expect(isRawElement(answer.children![0], paragraphSchema)).toBe(true);
      expect(isRawElement(answer.children![1], problemSectionSchema)).toBe(
        true,
      );
      expect(answer.children![1].data).toBe('answer section 1');
    });
  });
});

describe('Problem Check', () => {
  it('should create problem check correctly', () => {
    isolateProse(() => {
      prepareRegistry();

      const singleAnswerCheck = asEruditRaw(<ProblemCheck answer="foo" />);
      expect(isRawElement(singleAnswerCheck, problemCheckSchema)).toBe(true);
      expect(singleAnswerCheck.data.answers).toEqual(['foo']);

      const multipleAnswersCheck = asEruditRaw(
        <ProblemCheck answers={['foo', 3, 'baz']} />,
      );
      expect(multipleAnswersCheck.data.answers).toEqual(['foo', '3', 'baz']);

      const regexAnswerCheck = asEruditRaw(<ProblemCheck answer={/yes|no/i} />);
      expect(regexAnswerCheck.data.answers).toEqual([
        { pattern: 'yes|no', flags: 'i' },
      ]);

      const scriptCheck = asEruditRaw(<ProblemCheck script="check1" />);
      expect(scriptCheck.data.script).toBe('check1');

      const undefinedAnswerCheck = asEruditRaw(
        <ProblemCheck answer={undefined} />,
      );
      expect(undefinedAnswerCheck.data.answers).toEqual([undefined]);

      const multipleWithUndefinedCheck = asEruditRaw(
        <ProblemCheck answers={['foo', undefined, 42]} />,
      );
      expect(multipleWithUndefinedCheck.data.answers).toEqual([
        'foo',
        undefined,
        '42',
      ]);
    });
  });

  it('should allow nested checks', () => {
    isolateProse(() => {
      prepareRegistry();

      const nestedCheck = asEruditRaw(
        <ProblemCheck answer="foo">
          <ProblemCheck answer="bar" />
        </ProblemCheck>,
      );

      expect(isRawElement(nestedCheck, problemCheckSchema)).toBe(true);
      expect(nestedCheck.children).toHaveLength(1);
      expect(isRawElement(nestedCheck.children![0], problemCheckSchema)).toBe(
        true,
      );
    });
  });
});

describe('checkValue', () => {
  describe('single and multiple answers', () => {
    const cases = [
      { input: 'foo', answers: ['foo'], expected: true },
      { input: 'bar', answers: ['foo'], expected: false },
      { input: undefined, answers: ['foo'], expected: false },

      { input: 'foo', answers: ['foo', 'bar'], expected: true },
      { input: 'bar', answers: ['foo', 'bar'], expected: true },
      { input: 'baz', answers: ['foo', 'bar'], expected: false },
    ];

    it.each(cases)(
      'checks input $input against answers $answers',
      ({ input, answers, expected }) => {
        expect(checkValue(input, { answers })).toBe(expected);
      },
    );
  });

  describe('undefined and empty normalization', () => {
    const cases = [
      { input: undefined, answers: [undefined], expected: true },
      { input: '', answers: [undefined], expected: true },
      { input: '   ', answers: [undefined], expected: true },
      { input: 'foo', answers: [undefined], expected: false },
    ];

    it.each(cases)(
      'checks input $input against answers $answers',
      ({ input, answers, expected }) => {
        expect(checkValue(input, { answers })).toBe(expected);
      },
    );

    it('normalizes internal whitespace', () => {
      expect(checkValue('hello    world', { answers: ['hello world'] })).toBe(
        true,
      );
    });
  });

  describe('regex answers', () => {
    it('matches regex patterns', () => {
      expect(
        checkValue('123', {
          answers: [{ pattern: '^[0-9]+$', flags: '' }],
        }),
      ).toBe(true);

      expect(
        checkValue('abc', {
          answers: [{ pattern: '^[0-9]+$', flags: '' }],
        }),
      ).toBe(false);
    });

    it('supports regex flags', () => {
      expect(
        checkValue('FoO', {
          answers: [{ pattern: 'foo', flags: 'i' }],
        }),
      ).toBe(true);
    });

    it('does not match undefined or empty input', () => {
      const data = {
        answers: [{ pattern: '.*', flags: '' }],
      };

      expect(checkValue(undefined, data)).toBe(false);
      expect(checkValue('', data)).toBe(false);
      expect(checkValue('foo', data)).toBe(true);
    });

    it('fails safely on invalid regex', () => {
      expect(
        checkValue('test', {
          answers: [{ pattern: '[', flags: '' }],
        }),
      ).toBe(false);
    });
  });

  describe('set matching', () => {
    it('matches unordered sets', () => {
      const data = {
        set: {
          separator: ',',
          values: [['1'], ['2']],
        },
      };

      expect(checkValue('1, 2', data)).toBe(true);
      expect(checkValue('2, 1', data)).toBe(true);
    });

    it('rejects mismatched length or values', () => {
      const data = {
        set: {
          separator: ',',
          values: [['1'], ['2']],
        },
      };

      expect(checkValue('1, 1', data)).toBe(false);
      expect(checkValue('1, 3', data)).toBe(false);
      expect(checkValue('1, 2, 3', data)).toBe(false);
    });

    it('supports duplicate values when explicitly defined', () => {
      const data = {
        set: {
          separator: ',',
          values: [['1'], ['1'], ['2']],
        },
      };

      expect(checkValue('1, 2, 1', data)).toBe(true);
      expect(checkValue('1, 1', data)).toBe(false);
    });

    it('supports alternatives per position', () => {
      const data = {
        set: {
          separator: ',',
          values: [['1'], ['2', '3']],
        },
      };

      expect(checkValue('1, 2', data)).toBe(true);
      expect(checkValue('1, 3', data)).toBe(true);
      expect(checkValue('3, 1', data)).toBe(true);
      expect(checkValue('2, 2', data)).toBe(false);
    });

    it('supports regex values', () => {
      const data = {
        set: {
          separator: ',',
          values: [['1'], [{ pattern: '^[a-z]+$', flags: '' }]],
        },
      };

      expect(checkValue('1, abc', data)).toBe(true);
      expect(checkValue('xyz, 1', data)).toBe(true);
      expect(checkValue('1, 123', data)).toBe(false);
    });

    it('rejects undefined or empty input', () => {
      const data = {
        set: {
          separator: ',',
          values: [['1'], ['2']],
        },
      };

      expect(checkValue(undefined, data)).toBe(false);
      expect(checkValue('', data)).toBe(false);
      expect(checkValue('   ', data)).toBe(false);
    });

    it('normalizes spacing around separators', () => {
      const data = {
        set: {
          separator: ',',
          values: [['1'], ['2']],
        },
      };

      expect(checkValue(' 1 ,  2 ', data)).toBe(true);
    });
  });

  describe('numeric strings', () => {
    it.each(['42', '42.5', '0'])('accepts %s', (value) => {
      expect(checkValue(value, { answers: [value] })).toBe(true);
    });
  });
});

describe('validateProblemContent', () => {
  it('throws on invalid child', () => {
    isolateProse(() => {
      prepareRegistry();

      expect(() => {
        const content = asEruditRaw(
          <>
            <ProblemDescription>
              <P>Valid description</P>
            </ProblemDescription>
            <P>Invalid paragraph</P>
          </>,
        );

        validateProblemContent('Foo', content.children as any);
      }).toThrow(ProseError);
    });
  });

  it('accepts valid problem content', () => {
    isolateProse(() => {
      prepareRegistry();

      expect(() => {
        const content = asEruditRaw(
          <>
            <ProblemDescription>
              <P>Valid description</P>
            </ProblemDescription>

            <ProblemAnswer>
              <ProblemSection title="Answer">
                <P>Answer content</P>
              </ProblemSection>
            </ProblemAnswer>

            <ProblemHint>
              <P>Hint</P>
            </ProblemHint>

            <ProblemCheck hint="Hint" answer="42" />
          </>,
        );

        validateProblemContent('Foo', content.children as any);
      }).not.toThrow();
    });
  });
});
