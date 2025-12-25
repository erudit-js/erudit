import { describe, expect, it } from 'vitest';
import {
    defineUnique,
    isolateProse,
    isProseElement,
    isRawElement,
} from '@jsprose/core';

import { P } from '@erudit-js/prose/elements/paragraph/core';
import {
    stringifyProblemScriptId,
    defineProblemScript,
    insertProblemScriptId,
} from '@erudit-js/prose/elements/problem/problemScript';
import {
    ProblemCheck,
    problemCheckSchema,
    ProblemDescription,
    problemDescriptionSchema,
} from '@erudit-js/prose/elements/problem/problemContent';

import { prepareRegistry } from './problemContent.test';

describe('Problem Script', () => {
    it('should throw when ID is not provided', () => {
        expect(() => {
            defineProblemScript({});
        }).toThrow();
    });

    const createUniqueP = () => {
        return defineUnique({
            documentId: 'doc1',
            name: 'myP',
            tag: P,
        });
    };

    it('should throw when incorrect problem content builder is provided', async () => {
        isolateProse(async () => {
            prepareRegistry();

            const problemScript = defineProblemScript(
                stringifyProblemScriptId('script1', 'TestScript'),
                {
                    uniques: {
                        myP: P,
                    },
                },
            )(({ uniques }) => {
                return (
                    <>
                        <P $={uniques.myP}>This is paragraph</P>
                    </>
                );
            });

            expect(() =>
                problemScript({
                    myP: createUniqueP(),
                }).createProblemContent(),
            ).toThrow(/\[Problem Script\]/);
        });
    });

    it('should create problem script correctly', async () => {
        isolateProse(async () => {
            prepareRegistry();
            const problemScript = defineProblemScript(
                stringifyProblemScriptId('script1', 'TestScript'),
                {
                    isGenerator: true,
                    uniques: {
                        myP: P,
                    },
                },
            )(({ uniques, initial, random }) => {
                return (
                    <>
                        <ProblemDescription>
                            <P $={uniques.myP}>Problem Description</P>
                        </ProblemDescription>
                        <ProblemCheck answer={42} />
                    </>
                );
            });

            const problemContent = problemScript({
                myP: createUniqueP(),
            }).createProblemContent(1337);

            expect(problemContent).toHaveLength(2);
            expect(
                isRawElement(problemContent[0], problemDescriptionSchema),
            ).toBe(true);
            expect(isRawElement(problemContent[1], problemCheckSchema)).toBe(
                true,
            );
        });
    });

    it('should insert script ID correctly', () => {
        const code = `
export const A = defineProblemScript({
  foo: 1
});

export const C = defineProblemScript("already:here", {
  c: 3
});

export const D = defineProblemScript({ d: 4 });

export const E = defineProblemScript()(() => <></>);

const myScript = exports.myScript = defineProblemScript()(() => <></>);
        `.trim();

        const scriptSrc = 'myScriptSource';
        const transformedCode = insertProblemScriptId(scriptSrc, code);

        expect(transformedCode).toBe(
            `
export const A = defineProblemScript('myScriptSource/A', {
  foo: 1
});

export const C = defineProblemScript("already:here", {
  c: 3
});

export const D = defineProblemScript('myScriptSource/D', { d: 4 });

export const E = defineProblemScript('myScriptSource/E', )(() => <></>);

const myScript = exports.myScript = defineProblemScript('myScriptSource/myScript', )(() => <></>);
        `.trim(),
        );
    });

    it('should not throw when defining problem script without arg object', () => {
        expect(() => {
            defineProblemScript('scriptSrc/scriptName')(() => (
                <ProblemDescription>Description</ProblemDescription>
            ));
        }).not.toThrow();
    });
});
