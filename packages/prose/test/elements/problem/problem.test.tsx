import { describe, expect, it } from 'vitest';
import {
    defineUnique,
    isolateProse,
    isRawElement,
    PROSE_REGISTRY,
} from '@jsprose/core';

import { P } from '@erudit-js/prose/elements/paragraph/core';
import {
    Problem,
    problemRegistryItem,
    problemSchema,
} from '@erudit-js/prose/elements/problem/problem';
import {
    problemAnswer,
    ProblemDescription,
    problemDescriptionSchema,
} from '@erudit-js/prose/elements/problem/problemContent';
import { asEruditRaw, resolveEruditRawElement } from '@erudit-js/prose';
import { defineProblemScript } from '@erudit-js/prose/elements/problem/problemScript';

import { prepareRegistry, ProblemAnswer } from './problemContent.test';

export const problemScript = defineProblemScript('myScriptSrc/myScriptName', {
    isGenerator: false,
    initialSeed: 'my-seed!',
})(() => (
    <>
        <ProblemDescription>Hello World!</ProblemDescription>
        <ProblemAnswer>
            <P>This is my answer!</P>
        </ProblemAnswer>
    </>
));

const _prepareRegistry = () => {
    prepareRegistry();
    PROSE_REGISTRY.addItem(problemRegistryItem);
};

describe('Problem', () => {
    it('should throw when script and children are both provided', () => {
        isolateProse(() => {
            _prepareRegistry();

            expect(() => (
                <Problem title="Foo Problem" level="hard" script={{} as any}>
                    <ProblemDescription>
                        <P>Problem description</P>
                    </ProblemDescription>
                </Problem>
            )).toThrow();
        });
    });

    it('should throw when problem content children are invalid', () => {
        isolateProse(() => {
            _prepareRegistry();

            expect(() => (
                <Problem title="Invalid Problem" level="medium">
                    <P>Invalid child</P>
                </Problem>
            )).toThrow();
        });
    });

    it('should create problem with script correctly', () => {
        isolateProse(() => {
            _prepareRegistry();

            const scriptProblem = asEruditRaw(
                <Problem
                    title="Script Problem"
                    level="example"
                    applied
                    search
                    script={problemScript()}
                />,
            );

            expect(isRawElement(scriptProblem, problemSchema)).toBe(true);
            expect(scriptProblem.children!.length).toBe(2);
            expect(
                isRawElement(
                    scriptProblem.children![0],
                    problemDescriptionSchema,
                ),
            ).toBe(true);
            expect(
                isRawElement(scriptProblem.children![1], problemAnswer.schema),
            ).toBe(true);
            expect(scriptProblem.data.info).toStrictEqual({
                title: 'Script Problem',
                level: 'example',
                attributes: ['applied'],
            });
            expect(scriptProblem.title).toBe('Script Problem');
            expect(scriptProblem.snippet).toEqual({
                title: 'Script Problem',
            });
            expect(scriptProblem.snippetFlags).toEqual({
                search: true,
                quick: undefined,
                seo: true,
            });
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

        isolateProse(() => {
            _prepareRegistry();

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
    });

    it('should create problem with children correctly', () => {
        isolateProse(() => {
            _prepareRegistry();

            const childProblem = asEruditRaw(
                <Problem title="Child Problem" level="easy" search>
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
                isRawElement(
                    childProblem.children![0],
                    problemDescriptionSchema,
                ),
            ).toBe(true);
            expect(childProblem.title).toBe('Child Problem');
            expect(childProblem.snippet).toEqual({
                title: 'Child Problem',
            });
            expect(childProblem.snippetFlags).toEqual({
                search: true,
                quick: undefined,
                seo: true,
            });
        });
    });
});

describe('problemScriptStep', () => {
    it('should collect problem scripts', async () => {
        await isolateProse(async () => {
            _prepareRegistry();

            const { problemScripts } = await resolveEruditRawElement({
                context: {
                    language: 'en',
                    linkable: true,
                },
                rawElement: (
                    <>
                        <Problem
                            title="Script Problem"
                            level="example"
                            applied
                            script={problemScript()}
                        />
                    </>
                ),
            });

            expect(problemScripts).toEqual(
                new Set(['myScriptSrc/myScriptName']),
            );
        });
    });
});
