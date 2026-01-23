//
// <>
//     <ProblemDescription>
//     <ProblemHint>
//     <...>
//     <ProblemNote>
//         <ProblemSection>
//         <...>
//     <ProblemSolution>
//         <ProblemSection>
//         <...>
//     <ProblemAnswer>
//         <ProblemSection>
//         <...>
//     <ProblemCheck>
//     <...>
// </>
//

import {
    defineRegistryItem,
    defineSchema,
    ensureTagChildren,
    ensureTagNoChildren,
    isRawElement,
    ProseError,
    type AnySchema,
    type BlockSchema,
    type NormalizedChildren,
    type NoTagChildren,
    type TagChildren,
} from '@jsprose/core';

import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';
import { uppercaseFirst, type UppercaseFirst } from '../../utils/case.js';
import type { EruditRawElement } from '../../rawElement.js';
import { tryParagraphWrap } from '../../shared/paragraphWrap.js';

//
// Description
//

export const problemDescriptionSchema = defineSchema({
    name: 'problemDescription',
    type: 'block',
    linkable: false,
})<{
    Data: undefined;
    Storage: undefined;
    Children: AnySchema[];
}>();

export const ProblemDescription = defineEruditTag({
    tagName: 'ProblemDescription',
    schema: problemDescriptionSchema,
})<TagChildren>(({ element, tagName, children }) => {
    ensureTagChildren(tagName, children);
    element.children = children;

    const paragraphWrap = tryParagraphWrap(children);
    if (paragraphWrap) {
        element.children = paragraphWrap;
    }
});

export const problemDescriptionRegistryItem = defineRegistryItem({
    schema: problemDescriptionSchema,
    tags: [ProblemDescription],
});

export const problemDescriptionCoreElement = defineEruditProseCoreElement({
    registryItem: problemDescriptionRegistryItem,
});

//
// Hint
//

export const problemHintSchema = defineSchema({
    name: 'problemHint',
    type: 'block',
    linkable: false,
})<{
    Data: undefined;
    Storage: undefined;
    Children: AnySchema[];
}>();

export const ProblemHint = defineEruditTag({
    tagName: 'ProblemHint',
    schema: problemHintSchema,
})<TagChildren>(({ element, tagName, children }) => {
    ensureTagChildren(tagName, children);
    element.children = children;

    const paragraphWrap = tryParagraphWrap(children);
    if (paragraphWrap) {
        element.children = paragraphWrap;
    }
});

export const problemHintRegistryItem = defineRegistryItem({
    schema: problemHintSchema,
    tags: [ProblemHint],
});

export const problemHintCoreElement = defineEruditProseCoreElement({
    registryItem: problemHintRegistryItem,
});

//
// Section
//

export const problemSectionSchema = defineSchema({
    name: 'problemSection',
    type: 'block',
    linkable: false,
})<{
    Data: string;
    Storage: undefined;
    Children: AnySchema[];
}>();

export const ProblemSection = defineEruditTag({
    tagName: 'ProblemSection',
    schema: problemSectionSchema,
})<{ title: string } & TagChildren>(({ element, tagName, props, children }) => {
    ensureTagChildren(tagName, children);
    element.children = children;

    const paragraphWrap = tryParagraphWrap(children);
    if (paragraphWrap) {
        element.children = paragraphWrap;
    }

    const title = props.title.trim();
    if (!title) {
        throw new ProseError(
            `${tagName} title prop must be a non-empty string.`,
        );
    }

    element.data = title;
});

export const problemSectionRegistryItem = defineRegistryItem({
    schema: problemSectionSchema,
    tags: [ProblemSection],
});

export const problemSectionCoreElement = defineEruditProseCoreElement({
    registryItem: problemSectionRegistryItem,
});

function defineProblemSectionContainer<TName extends string>(name: TName) {
    const schema = defineSchema({
        name: `problem${uppercaseFirst(name)}` as `problem${UppercaseFirst<TName>}`,
        type: 'block',
        linkable: false,
    })<{
        Data: undefined;
        Storage: undefined;
        Children: AnySchema[];
    }>();

    const tag = defineEruditTag({
        tagName:
            `Problem${uppercaseFirst(name)}` as `Problem${UppercaseFirst<TName>}`,
        schema,
    })<TagChildren>(({ element, tagName, children }) => {
        ensureTagChildren(tagName, children);

        const sectionChildren: EruditRawElement<typeof problemSectionSchema>[] =
            [];
        const nonSectionChildren: EruditRawElement<AnySchema>[] = [];

        let seenSection = false;
        for (const child of children) {
            if (isRawElement(child, problemSectionSchema)) {
                sectionChildren.push(child);
                seenSection = true;
            } else {
                if (seenSection) {
                    throw new ProseError(
                        `${tagName} non-section children must appear before any <ProblemSection> child.`,
                    );
                }
                nonSectionChildren.push(child);
            }
        }

        const paragraphWrap = tryParagraphWrap(
            nonSectionChildren as NormalizedChildren,
        );
        const wrappedNonSectionChildren = paragraphWrap ?? nonSectionChildren;

        element.children = [...wrappedNonSectionChildren, ...sectionChildren];
    });

    const registryItem = defineRegistryItem({
        schema,
        tags: [tag],
    });

    const coreElement = defineEruditProseCoreElement({
        registryItem,
    });

    return {
        schema,
        tag,
        registryItem,
        coreElement,
    };
}

//
// Section Containers
//

export const problemNote = defineProblemSectionContainer('note');
export const problemSolution = defineProblemSectionContainer('solution');
export const problemAnswer = defineProblemSectionContainer('answer');

//
// Problem Check
//

export type CheckFunction = (args: {
    answer: string | undefined;
    name: string;
    answers: Record<string, string | undefined>;
}) => boolean;

export interface ProblemCheckRegex {
    pattern: string;
    flags: string;
}

export type ProblemCheckValue = string | ProblemCheckRegex;

export interface ProblemCheckData {
    label?: string;
    hint?: string;
    placeholder?: string;
    set?: {
        separator: string;
        values: (ProblemCheckValue | ProblemCheckValue[])[];
    };
    answers?: ProblemCheckValue[];
    script?: string;
}

export function checkValue(
    input: string | undefined,
    data: ProblemCheckData,
): boolean {
    const normalizedInput = input?.trim().replace(/\s+/g, ' ') || undefined;

    const matchSingle = (
        val: string | undefined,
        condition: ProblemCheckValue,
    ) => {
        const v = val || '';
        if (typeof condition === 'string') {
            return v === condition;
        }
        try {
            const re = new RegExp(condition.pattern, condition.flags);
            return re.test(v);
        } catch {
            return false;
        }
    };

    if (data.answers) {
        if (!normalizedInput) return false;
        return data.answers.some((ans) => matchSingle(normalizedInput, ans));
    }

    if (data.set) {
        const { separator, values } = data.set;

        const separatorRegex = new RegExp(
            `\\s*${separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`,
        );

        const inputValues = normalizedInput
            ? normalizedInput
                  .split(separatorRegex)
                  .map((v) => v.trim())
                  .filter((v) => v)
            : [];

        if (inputValues.length !== values.length) {
            return false;
        }

        const canMatch = (
            inputVal: string,
            expectedVal: ProblemCheckValue | ProblemCheckValue[],
        ) => {
            if (Array.isArray(expectedVal)) {
                return expectedVal.some((ev) => matchSingle(inputVal, ev));
            }
            return matchSingle(inputVal, expectedVal);
        };

        const adj = inputValues.map((inputVal) =>
            values
                .map((v, idx) => (canMatch(inputVal, v) ? idx : -1))
                .filter((idx) => idx !== -1),
        );

        const matchV = new Array(values.length).fill(-1);
        const vis = new Array(values.length).fill(false);

        const dfs = (u: number) => {
            for (const v of adj[u]) {
                if (vis[v]) continue;
                vis[v] = true;
                if (matchV[v] < 0 || dfs(matchV[v])) {
                    matchV[v] = u;
                    return true;
                }
            }
            return false;
        };

        let matches = 0;
        for (let i = 0; i < inputValues.length; i++) {
            vis.fill(false);
            if (dfs(i)) {
                matches++;
            }
        }

        return matches === values.length;
    }

    return false;
}

export const problemCheckSchema = defineSchema({
    name: 'problemCheck',
    type: 'block',
    linkable: false,
})<{
    Data: ProblemCheckData;
    Storage: undefined;
    Children: BlockSchema[];
}>();

type UndefinedOnly<T> = {
    [K in keyof T]?: undefined;
};

type OneOf<T extends Record<string, any>> = {
    [K in keyof T]: Pick<T, K> & UndefinedOnly<Omit<T, K>>;
}[keyof T];

export const ProblemCheck = defineEruditTag({
    tagName: 'ProblemCheck',
    schema: problemCheckSchema,
})<
    { label?: string; hint?: string; placeholder?: string } & OneOf<{
        answer: string | number | RegExp;
        answers: (string | number | RegExp)[];
        set:
            | (string | number | RegExp | (string | number | RegExp)[])[]
            | {
                  separator: string;
                  values: (
                      | string
                      | number
                      | RegExp
                      | (string | number | RegExp)[]
                  )[];
              };
        script: string;
    }> &
        NoTagChildren
>(({ element, tagName, props, children }) => {
    ensureTagNoChildren(tagName, children);

    const normalizeCheckValue = (
        val: string | number | RegExp,
    ): ProblemCheckValue => {
        if (val instanceof RegExp) {
            return { pattern: val.source, flags: val.flags };
        }
        return String(val);
    };

    if (props.answer !== undefined) {
        element.data = {
            ...element.data,
            answers: [normalizeCheckValue(props.answer)],
        };
    } else if (props.answers !== undefined) {
        element.data = {
            ...element.data,
            answers: props.answers.map(normalizeCheckValue),
        };
    } else if (props.script !== undefined) {
        element.data = {
            ...element.data,
            script: props.script,
        };
    } else if (props.set !== undefined) {
        const normalizeSetItem = (
            v: string | number | RegExp | (string | number | RegExp)[],
        ): ProblemCheckValue | ProblemCheckValue[] =>
            Array.isArray(v)
                ? v.map(normalizeCheckValue)
                : normalizeCheckValue(v);

        if (Array.isArray(props.set)) {
            element.data = {
                ...element.data,
                set: {
                    separator: ',',
                    values: props.set.map(normalizeSetItem),
                },
            };
        } else {
            element.data = {
                ...element.data,
                set: {
                    separator: props.set.separator,
                    values: props.set.values.map(normalizeSetItem),
                },
            };
        }
    }

    if (props.label !== undefined) {
        element.data = {
            ...element.data,
            label: props.label,
        };
    }

    if (props.hint !== undefined) {
        element.data = {
            ...element.data,
            hint: props.hint,
        };
    }

    if (props.placeholder !== undefined) {
        element.data = {
            ...element.data,
            placeholder: props.placeholder,
        };
    }
});

export const problemCheckRegistryItem = defineRegistryItem({
    schema: problemCheckSchema,
    tags: [ProblemCheck],
});

export const problemCheckCoreElement = defineEruditProseCoreElement({
    registryItem: problemCheckRegistryItem,
});

//
// Problem Content
//

export type ProblemContentChild =
    | typeof problemDescriptionSchema
    | typeof problemHintSchema
    | typeof problemNote.schema
    | typeof problemSolution.schema
    | typeof problemAnswer.schema
    | typeof problemCheckSchema;

export function validateProblemContent(
    source: string,
    children: NormalizedChildren,
) {
    ensureTagChildren(source, children, [
        problemDescriptionSchema,
        problemHintSchema,
        problemNote.schema,
        problemSolution.schema,
        problemAnswer.schema,
        problemCheckSchema,
    ]);

    const uniques = [
        { schema: problemDescriptionSchema, label: 'ProblemDescription' },
        { schema: problemSolution.schema, label: 'ProblemSolution' },
        { schema: problemAnswer.schema, label: 'ProblemAnswer' },
    ] as const;

    const found = new Set<string>();

    for (const child of children) {
        for (const { schema, label } of uniques) {
            if (isRawElement(child, schema)) {
                if (found.has(label)) {
                    throw new ProseError(
                        `
Invalid problem content at ${source}:
It can contain only one <${label}>!
                        `.trim(),
                    );
                }
                found.add(label);
                break;
            }
        }
    }
}
