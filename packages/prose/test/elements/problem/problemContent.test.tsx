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

            expect(isRawElement(description, problemDescriptionSchema)).toBe(
                true,
            );
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

            expect(isRawElement(answer.children![0], paragraphSchema)).toBe(
                true,
            );
            expect(
                isRawElement(answer.children![1], problemSectionSchema),
            ).toBe(true);
            expect(answer.children![1].data).toBe('answer section 1');
        });
    });
});

describe('Problem Check', () => {
    it('should create problem check correctly', () => {
        isolateProse(() => {
            prepareRegistry();

            const singleAnswerCheck = asEruditRaw(
                <ProblemCheck answer="foo" />,
            );
            expect(isRawElement(singleAnswerCheck, problemCheckSchema)).toBe(
                true,
            );
            expect(singleAnswerCheck.data.answers).toEqual(['foo']);

            const multipleAnswersCheck = asEruditRaw(
                <ProblemCheck answers={['foo', 3, 'baz']} />,
            );
            expect(multipleAnswersCheck.data.answers).toEqual([
                'foo',
                '3',
                'baz',
            ]);

            const regexAnswerCheck = asEruditRaw(
                <ProblemCheck answer={/yes|no/i} />,
            );
            expect(regexAnswerCheck.data.answers).toEqual([
                { pattern: 'yes|no', flags: 'i' },
            ]);

            const scriptCheck = asEruditRaw(<ProblemCheck script="check1" />);
            expect(scriptCheck.data.script).toBe('check1');
        });
    });
});

describe('checkValue', () => {
    it('should check single answer', () => {
        expect(checkValue('foo', { answers: ['foo'] })).toBe(true);
        expect(checkValue('bar', { answers: ['foo'] })).toBe(false);
        expect(checkValue(undefined, { answers: ['foo'] })).toBe(false);
    });

    it('should check multiple answers', () => {
        expect(checkValue('foo', { answers: ['foo', 'bar'] })).toBe(true);
        expect(checkValue('bar', { answers: ['foo', 'bar'] })).toBe(true);
        expect(checkValue('baz', { answers: ['foo', 'bar'] })).toBe(false);
    });

    it('should check regex answer', () => {
        const regexData = {
            answers: [{ pattern: '^[0-9]+$', flags: '' }],
        };
        expect(checkValue('123', regexData)).toBe(true);
        expect(checkValue('abc', regexData)).toBe(false);

        const regexFlagsData = {
            answers: [{ pattern: 'foo', flags: 'i' }],
        };
        expect(checkValue('FoO', regexFlagsData)).toBe(true);
    });

    it('should check set', () => {
        const setData = {
            set: {
                separator: ',',
                values: [['1'], ['2']],
            },
        };

        expect(checkValue('1, 2', setData)).toBe(true);
        expect(checkValue('2, 1', setData)).toBe(true);
        expect(checkValue('1, 1', setData)).toBe(false); // Duplicates not allowed in set def unless defined
        expect(checkValue('1, 3', setData)).toBe(false);
        expect(checkValue('1, 2, 3', setData)).toBe(false);
    });

    it('should check set with duplicates allowed', () => {
        const setData = {
            set: {
                separator: ',',
                values: [['1'], ['1'], ['2']],
            },
        };
        expect(checkValue('1, 2, 1', setData)).toBe(true);
        expect(checkValue('1, 1', setData)).toBe(false);
        expect(checkValue('1, 3', setData)).toBe(false);
    });

    it('should check set with alternatives', () => {
        const setData = {
            set: {
                separator: ',',
                values: [['1'], ['2', '3']],
            },
        };
        expect(checkValue('1, 2', setData)).toBe(true);
        expect(checkValue('1, 3', setData)).toBe(true);
        expect(checkValue('3, 1', setData)).toBe(true);
        expect(checkValue('2, 2', setData)).toBe(false);
    });

    it('should check set with regex', () => {
        const setData = {
            set: {
                separator: ',',
                values: [['1'], [{ pattern: '^[a-z]+$', flags: '' }]],
            },
        };
        expect(checkValue('1, abc', setData)).toBe(true);
        expect(checkValue('xyz, 1', setData)).toBe(true);
        expect(checkValue('1, 123', setData)).toBe(false);
    });

    it('should normalise input', () => {
        expect(
            checkValue('  foo  ', {
                answers: ['foo'],
            }),
        ).toBe(true);

        const setData = {
            set: {
                separator: ',',
                values: [['1'], ['2']],
            },
        };
        expect(checkValue(' 1 ,  2 ', setData)).toBe(true);
    });
});

describe('validateProblemContent', () => {
    it('should throw when invalid child is present', () => {
        isolateProse(() => {
            prepareRegistry();

            expect(() => {
                const problemContent = asEruditRaw(
                    <>
                        <ProblemDescription>
                            <P>Valid description</P>
                        </ProblemDescription>
                        <P>Invalid paragraph</P>
                    </>,
                );
                validateProblemContent('Foo', problemContent.children as any);
            }).toThrow(ProseError);
        });
    });

    it('should not throw when all children are valid', () => {
        isolateProse(() => {
            prepareRegistry();
            expect(() => {
                const problemContent = asEruditRaw(
                    <>
                        <ProblemDescription>
                            <P>Valid description</P>
                        </ProblemDescription>
                        <ProblemAnswer>
                            <ProblemSection title="Answer Section">
                                <P>Answer content</P>
                            </ProblemSection>
                        </ProblemAnswer>
                        <ProblemHint>
                            <P>Valid hint</P>
                        </ProblemHint>
                        <ProblemCheck hint="Foo Hint" answer="42" />
                    </>,
                );
                validateProblemContent('Foo', problemContent.children as any);
            }).not.toThrow();
        });
    });
});
