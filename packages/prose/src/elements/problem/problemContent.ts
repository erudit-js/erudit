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
    i: number;
    answers: Record<number | string, string | undefined>;
}) => boolean;

export interface ProblemCheckData {
    label?: string;
    hint?: string;
    placeholder?: string;
    answers?: (string | undefined)[];
    script?: true;
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

export const ProblemCheck = defineEruditTag({
    tagName: 'ProblemCheck',
    schema: problemCheckSchema,
})<
    { label?: string; hint?: string; placeholder?: string } & (
        | { answer: string | number; answers?: undefined; script?: undefined }
        | {
              answers: (string | number)[];
              answer?: undefined;
              script?: undefined;
          }
        | { script: true; answers?: undefined; answer?: undefined }
    ) &
        NoTagChildren
>(({ element, tagName, props, children }) => {
    ensureTagNoChildren(tagName, children);

    if (props.answer !== undefined) {
        element.data = {
            ...element.data,
            answers: [String(props.answer)],
        };
    } else if (props.answers !== undefined) {
        element.data = {
            ...element.data,
            answers: props.answers.map(String),
        };
    } else if (props.script !== undefined) {
        element.data = {
            ...element.data,
            script: true,
        };
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
