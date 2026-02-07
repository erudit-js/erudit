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
  ProblemDescription,
  problemDescriptionSchema,
  ProblemHint,
  problemHintSchema,
  ProblemSection,
  problemSectionRegistryItem,
  problemSectionSchema,
  validateProblemContent,
} from '@erudit-js/prose/elements/problem/problemContent';
import {
  ProblemCheck,
  problemCheckRegistryItem,
} from '@erudit-js/prose/elements/problem/problemCheck';

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
