import { describe, expect, it } from 'vitest';
import { isRawElement, TSProseError } from 'tsprose';

import { asEruditRaw } from '@src/rawElement';
import { P, paragraphSchema } from '@src/elements/paragraph/core';
import {
  problemAnswer,
  ProblemDescription,
  problemDescriptionSchema,
  ProblemHint,
  problemHintSchema,
  ProblemSection,
  problemSectionSchema,
  validateProblemContent,
} from '@src/elements/problem/problemContent';
import { ProblemCheck } from '@src/elements/problem/problemCheck';
import { EruditProseError } from '@src/error';

export const ProblemAnswer = problemAnswer.tag;

describe('Problem Description', () => {
  it('should create description correctly', () => {
    const description = asEruditRaw(
      <ProblemDescription>
        <P>First paragraph</P>
      </ProblemDescription>,
    );

    expect(isRawElement(description, problemDescriptionSchema)).toBe(true);
    expect(description.children).toHaveLength(1);
  });
});

describe('Problem Hint', () => {
  it('should create hint correctly', () => {
    const hint = asEruditRaw(
      <ProblemHint>
        <P>First paragraph</P>
      </ProblemHint>,
    );

    expect(isRawElement(hint, problemHintSchema)).toBe(true);
    expect(hint.children).toHaveLength(1);
  });
});

describe('Problem Section Container: Answer/Solution/Note', () => {
  it('should throw when section title is empty', () => {
    expect(() => (
      <ProblemSection title="">
        <P>Section content</P>
      </ProblemSection>
    )).toThrow();
  });

  it('should throw when non-section child appears after section child', () => {
    expect(() => (
      <ProblemAnswer>
        <ProblemSection title="section 1">
          <P>Section content</P>
        </ProblemSection>
        <P>Non section paragraph</P>
      </ProblemAnswer>
    )).toThrow();
  });

  it('should create problem section container correctly', () => {
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
    expect(isRawElement(answer.children![1], problemSectionSchema)).toBe(true);
    expect(answer.children![1].data).toBe('answer section 1');
  });
});

describe('validateProblemContent', () => {
  it('throws on invalid child', () => {
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
    }).toThrow();
  });

  it('accepts valid problem content', () => {
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
