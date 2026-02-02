//
// <Problem>
//   <ProblemDescription />
//   <ProblemHint />
//   <ProblemNote>
//     <ProblemSection title="..." />
//   </ProblemNote>
//   <ProblemSolution />
//   <ProblemAnswer />
//   <ProblemCheck />
// </Problem>
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

/* --------------------------------------------------------- */
/* shared helpers                                            */
/* --------------------------------------------------------- */

function defineParagraphBlock<TName extends string>(opts: {
    name: TName;
    tagName: UppercaseFirst<TName>;
}) {
    const schema = defineSchema({
        name: opts.name,
        type: 'block',
        linkable: false,
    })<{
        Data: undefined;
        Storage: undefined;
        Children: AnySchema[];
    }>();

    const tag = defineEruditTag({
        tagName: opts.tagName,
        schema,
    })<TagChildren>(({ element, tagName, children }) => {
        ensureTagChildren(tagName, children);
        element.children = tryParagraphWrap(children) ?? children;
    });

    const registryItem = defineRegistryItem({ schema, tags: [tag] });
    const coreElement = defineEruditProseCoreElement({ registryItem });

    return { schema, tag, registryItem, coreElement };
}

/* --------------------------------------------------------- */
/* description / hint                                        */
/* --------------------------------------------------------- */

export const problemDescription = defineParagraphBlock({
    name: 'problemDescription',
    tagName: 'ProblemDescription',
});

export const problemHint = defineParagraphBlock({
    name: 'problemHint',
    tagName: 'ProblemHint',
});

export const {
    schema: problemDescriptionSchema,
    tag: ProblemDescription,
    registryItem: problemDescriptionRegistryItem,
    coreElement: problemDescriptionCoreElement,
} = problemDescription;

export const {
    schema: problemHintSchema,
    tag: ProblemHint,
    registryItem: problemHintRegistryItem,
    coreElement: problemHintCoreElement,
} = problemHint;

/* --------------------------------------------------------- */
/* section                                                   */
/* --------------------------------------------------------- */

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
    element.children = tryParagraphWrap(children) ?? children;

    const title = props.title.trim();
    if (!title) {
        throw new ProseError(`${tagName} title must be non-empty.`);
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

/* --------------------------------------------------------- */
/* section containers                                        */
/* --------------------------------------------------------- */

function defineProblemSectionContainer<T extends string>(name: T) {
    const cap = uppercaseFirst(name);
    const schemaName = `problem${cap}` as `problem${UppercaseFirst<T>}`;
    const tagName = `Problem${cap}` as `Problem${UppercaseFirst<T>}`;

    const schema = defineSchema({
        name: schemaName,
        type: 'block',
        linkable: false,
    })<{ Data: undefined; Storage: undefined; Children: AnySchema[] }>();

    const tag = defineEruditTag({ tagName, schema })<TagChildren>(({
        element,
        children,
    }) => {
        const head: EruditRawElement<AnySchema>[] = [];
        const sections: EruditRawElement<typeof problemSectionSchema>[] = [];

        let seenSection = false;

        for (const child of children!) {
            if (isRawElement(child, problemSectionSchema)) {
                seenSection = true;
                sections.push(child);
            } else {
                if (seenSection) {
                    throw new ProseError(
                        `${tagName}: non-section children must come before <ProblemSection>.`,
                    );
                }
                head.push(child);
            }
        }

        element.children = [
            ...(tryParagraphWrap(head as NormalizedChildren) ?? head),
            ...sections,
        ];
    });

    const registryItem = defineRegistryItem({ schema, tags: [tag] });
    const coreElement = defineEruditProseCoreElement({ registryItem });

    return { schema, tag, registryItem, coreElement };
}

export const problemNote = defineProblemSectionContainer('note');
export const problemSolution = defineProblemSectionContainer('solution');
export const problemAnswer = defineProblemSectionContainer('answer');

/* --------------------------------------------------------- */
/* problem check types                                       */
/* --------------------------------------------------------- */

export type CheckFunction = (args: {
    answer: string | undefined;
    name: string;
    answers: Record<string, string | undefined>;
}) => boolean;

export interface ProblemCheckRegex {
    pattern: string;
    flags: string;
}

export type ProblemCheckValue = string | ProblemCheckRegex | undefined;
export type ProblemCheckSetValue = string | ProblemCheckRegex;

export interface ProblemCheckData {
    label?: string;
    hint?: string;
    placeholder?: string;
    answers?: ProblemCheckValue[];
    set?: {
        separator: string;
        values: (ProblemCheckSetValue | ProblemCheckSetValue[])[];
    };
    script?: string;
}

/* --------------------------------------------------------- */
/* value normalization + matching                            */
/* --------------------------------------------------------- */

type Answer = string | number | RegExp | undefined;

function normalizeValue(v: Answer): ProblemCheckValue {
    if (v === undefined) return undefined;
    if (v instanceof RegExp) {
        return { pattern: v.source, flags: v.flags };
    }
    return String(v);
}

function safeRegexTest(re: ProblemCheckRegex, value: string): boolean {
    try {
        return new RegExp(re.pattern, re.flags).test(value);
    } catch {
        return false;
    }
}

function matchSingle(
    value: string | undefined,
    expected: ProblemCheckValue,
): boolean {
    // Handle null as undefined (from JSON serialization)
    const normalizedExpected = expected === null ? undefined : expected;
    const normalizedValue = value === null ? undefined : value;

    if (normalizedExpected === undefined) return normalizedValue === undefined;
    if (typeof normalizedExpected === 'string')
        return normalizedValue === normalizedExpected;
    if (normalizedValue === undefined) return false;
    return safeRegexTest(normalizedExpected, normalizedValue);
}

function matchSet(
    value: string,
    set: NonNullable<ProblemCheckData['set']>,
): boolean {
    const sep = new RegExp(
        `\\s*${set.separator.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\s*`,
    );

    const inputs = value.split(sep).filter(Boolean);
    if (inputs.length !== set.values.length) return false;

    const canMatch = (
        v: string,
        expected: ProblemCheckSetValue | ProblemCheckSetValue[],
    ): boolean =>
        Array.isArray(expected)
            ? expected.some((e) =>
                  typeof e === 'string' ? v === e : safeRegexTest(e, v),
              )
            : typeof expected === 'string'
              ? v === expected
              : safeRegexTest(expected, v);

    const adj = inputs.map((v) =>
        set.values
            .map((e, i) => (canMatch(v, e) ? i : -1))
            .filter((i) => i !== -1),
    );

    const match = new Array(set.values.length).fill(-1);

    const dfs = (u: number, seen: boolean[]): boolean =>
        adj[u].some((v) => {
            if (seen[v]) return false;
            seen[v] = true;
            return match[v] === -1 || dfs(match[v], seen)
                ? ((match[v] = u), true)
                : false;
        });

    return inputs.every((_, i) =>
        dfs(i, new Array(set.values.length).fill(false)),
    );
}

export function checkValue(
    input: string | undefined,
    data: ProblemCheckData,
): boolean {
    const normalized = input?.trim().replace(/\s+/g, ' ') || undefined;

    if (data.answers) {
        return data.answers.some((a) => matchSingle(normalized, a));
    }

    if (data.set && normalized !== undefined) {
        return matchSet(normalized, data.set);
    }

    return false;
}

/* --------------------------------------------------------- */
/* problem check tag                                         */
/* --------------------------------------------------------- */

export const problemCheckSchema = defineSchema({
    name: 'problemCheck',
    type: 'block',
    linkable: false,
})<{
    Data: ProblemCheckData;
    Storage: undefined;
    Children: BlockSchema[];
}>();

type UndefinedOnly<T> = { [K in keyof T]?: undefined };

type OneOf<T extends Record<string, any>> = {
    [K in keyof T]: Pick<T, K> & UndefinedOnly<Omit<T, K>>;
}[keyof T];

export const ProblemCheck = defineEruditTag({
    tagName: 'ProblemCheck',
    schema: problemCheckSchema,
})<
    { label?: string; hint?: string; placeholder?: string } & OneOf<{
        answer: Answer;
        answers: Answer[];
        set:
            | (Answer | Answer[])[]
            | {
                  separator: string;
                  values: (Answer | Answer[])[];
              };
        script: string;
    }> &
        (TagChildren | NoTagChildren)
>(({ element, tagName, props, children }) => {
    if (children && children.length > 0) {
        ensureTagChildren(tagName, children, problemCheckSchema);
        element.children = children as any;
    } else {
        ensureTagNoChildren(tagName, children);
    }

    const data: ProblemCheckData = {};

    if ('answer' in props) {
        data.answers = [normalizeValue(props.answer)];
    } else if ('answers' in props) {
        data.answers = props.answers!.map(normalizeValue);
    } else if ('script' in props) {
        data.script = props.script;
    } else if ('set' in props) {
        const normalizeSetItem = (
            v: Answer | Answer[],
        ): ProblemCheckSetValue | ProblemCheckSetValue[] => {
            if (Array.isArray(v)) {
                return v.map((x) => {
                    const nv = normalizeValue(x);
                    if (!nv) {
                        throw new ProseError(
                            `${tagName}: undefined not allowed in set values.`,
                        );
                    }
                    return nv;
                });
            }

            const nv = normalizeValue(v);
            if (!nv) {
                throw new ProseError(
                    `${tagName}: undefined not allowed in set values.`,
                );
            }
            return nv;
        };

        if (Array.isArray(props.set)) {
            data.set = {
                separator: ',',
                values: props.set.map(normalizeSetItem),
            };
        } else {
            data.set = {
                separator: props.set.separator,
                values: props.set.values.map(normalizeSetItem),
            };
        }
    }

    if (props.label !== undefined) data.label = props.label;
    if (props.hint !== undefined) data.hint = props.hint;
    if (props.placeholder !== undefined) data.placeholder = props.placeholder;

    element.data = data;
});

export const problemCheckRegistryItem = defineRegistryItem({
    schema: problemCheckSchema,
    tags: [ProblemCheck],
});

export const problemCheckCoreElement = defineEruditProseCoreElement({
    registryItem: problemCheckRegistryItem,
});

/* --------------------------------------------------------- */
/* problem content validation                                */
/* --------------------------------------------------------- */

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

    const seen = new Set<string>();

    for (const child of children) {
        for (const { schema, label } of uniques) {
            if (isRawElement(child, schema)) {
                if (seen.has(label)) {
                    throw new ProseError(
                        `Invalid problem content at ${source}: only one <${label}> allowed.`,
                    );
                }
                seen.add(label);
                break;
            }
        }
    }
}
