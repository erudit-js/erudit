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
    ensureBlockChild,
    ensureHasChildren,
    type NormalizedChildren,
    type RawChildren,
} from '../../children';
import { isElement, type JsxElement } from '../../element';
import { ProseError } from '../../error';
import { defineGlobalElement } from '../../globalElement';
import type { BlockSchemaAny, ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

//
// Problem Description
//

export const problemDescriptionName = 'problemDescription';

export type ProblemDescriptionSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof problemDescriptionName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: BlockSchemaAny[];
}>;

export const ProblemDescription = defineTag('ProblemDescription')<
    ProblemDescriptionSchema,
    { children: RawChildren }
>({
    type: ElementType.Block,
    name: problemDescriptionName,
    linkable: false,
    initElement({ tagName, element, children }) {
        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<BlockSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureBlockChild(tagName, child);
    },
});

//
// Problem Hint
//

export const problemHintName = 'problemHint';

export type ProblemHintSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof problemHintName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: BlockSchemaAny[];
}>;

export const ProblemHint = defineTag('ProblemHint')<
    ProblemHintSchema,
    { children: RawChildren }
>({
    type: ElementType.Block,
    name: problemHintName,
    linkable: false,
    initElement({ tagName, element, children }) {
        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<BlockSchemaAny>[];
    },
    childStep({ tagName, child }) {
        ensureBlockChild(tagName, child);
    },
});

//
// Problem Section
//

export const problemSectionName = 'problemSection';

export type ProblemSectionSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof problemSectionName;
    Linkable: false;
    Data: string;
    Storage: undefined;
    Children: BlockSchemaAny[];
}>;

export const ProblemSection = defineTag('ProblemSection')<
    ProblemSectionSchema,
    { title: string; children: RawChildren }
>({
    type: ElementType.Block,
    name: problemSectionName,
    linkable: false,
    initElement({ tagName, element, children, props }) {
        ensureHasChildren(tagName, children);
        element.children = children as JsxElement<BlockSchemaAny>[];
        element.data = props.title;
    },
    childStep({ tagName, child }) {
        ensureBlockChild(tagName, child);
    },
});

type ProblemSectionContainerSchema<Name extends string> = ElementSchema<{
    Type: ElementType.Block;
    Name: Name;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: BlockSchemaAny[];
}>;

function defineProblemSectionContainer<
    const N extends string,
    DisplayName extends string,
>(tagName: DisplayName, nameConst: N) {
    return defineTag(tagName)<
        ProblemSectionContainerSchema<N>,
        { children: RawChildren }
    >({
        type: ElementType.Block,
        name: nameConst,
        linkable: false,
        initElement({ tagName, element, children }) {
            ensureHasChildren(tagName, children);
            const sectionChildren: JsxElement<ProblemSectionSchema>[] = [];
            const nonSectionChildren: JsxElement<BlockSchemaAny>[] = [];

            for (const child of children) {
                if (isElement(child, ProblemSection)) {
                    sectionChildren.push(child);
                } else {
                    ensureBlockChild(tagName, child);
                    nonSectionChildren.push(child);
                }
            }

            element.children = [...nonSectionChildren, ...sectionChildren];
        },
    });
}

//
// Problem Note
//

export const problemNoteName = 'problemNote';
export type ProblemNoteSchema = ProblemSectionContainerSchema<
    typeof problemNoteName
>;
export const ProblemNote = defineProblemSectionContainer(
    'ProblemNote',
    problemNoteName,
);

//
// Problem Solution
//

export const problemSolutionName = 'problemSolution';
export type ProblemSolutionSchema = ProblemSectionContainerSchema<
    typeof problemSolutionName
>;
export const ProblemSolution = defineProblemSectionContainer(
    'ProblemSolution',
    problemSolutionName,
);

//
// Problem Answer
//

export const problemAnswerName = 'problemAnswer';
export type ProblemAnswerSchema = ProblemSectionContainerSchema<
    typeof problemAnswerName
>;
export const ProblemAnswer = defineProblemSectionContainer(
    'ProblemAnswer',
    problemAnswerName,
);

//
// Problem Check
//

export const problemCheckName = 'problemCheck';

export type ProblemCheckData = {
    check: (answer: string) => boolean | Promise<boolean>;
    label?: string;
    hint?: string;
    placeholder?: string;
};

export type ProblemCheckSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof problemCheckName;
    Linkable: false;
    Data: ProblemCheckData;
    Storage: undefined;
    Children: undefined;
}>;

export const ProblemCheck = defineTag('ProblemCheck')<
    ProblemCheckSchema,
    {
        children?: undefined;
        check: (answer: string) => boolean | Promise<boolean>;
        label?: string;
        hint?: string;
        placeholder?: string;
    }
>({
    type: ElementType.Block,
    name: problemCheckName,
    linkable: false,
    initElement({ element, props }) {
        element.data = {
            check: props.check,
            label: props.label,
            hint: props.hint,
            placeholder: props.placeholder,
        };
    },
});

//
// Problem Content
//

export type ProblemContentChild =
    | ProblemDescriptionSchema
    | ProblemHintSchema
    | ProblemNoteSchema
    | ProblemSolutionSchema
    | ProblemAnswerSchema
    | ProblemCheckSchema;

export function validateProblemContent(
    tagName: string,
    children: NormalizedChildren,
) {
    ensureHasChildren(tagName, children);

    let descriptionCount = 0;

    for (const child of children!) {
        if (isElement(child, ProblemDescription)) {
            descriptionCount++;
            continue;
        }
        if (
            isElement(child, ProblemHint) ||
            isElement(child, ProblemNote) ||
            isElement(child, ProblemSolution) ||
            isElement(child, ProblemAnswer) ||
            isElement(child, ProblemCheck)
        ) {
            continue;
        }
        throw new ProseError(
            `<${tagName}> can only contain problem-related blocks (ProblemDescription, ProblemHint, ProblemNote, ProblemSolution, ProblemAnswer, ProblemCheck).`,
        );
    }

    if (descriptionCount !== 1) {
        throw new ProseError(
            `<${tagName}> must contain exactly one <ProblemDescription>.`,
        );
    }
}

//
//
//

export default [
    defineGlobalElement<ProblemDescriptionSchema>()({
        name: problemDescriptionName,
        tags: { ProblemDescription },
    }),
    defineGlobalElement<ProblemHintSchema>()({
        name: problemHintName,
        tags: { ProblemHint },
    }),
    defineGlobalElement<ProblemSectionSchema>()({
        name: problemSectionName,
        tags: { ProblemSection },
    }),
    defineGlobalElement<ProblemNoteSchema>()({
        name: problemNoteName,
        tags: { ProblemNote },
    }),
    defineGlobalElement<ProblemSolutionSchema>()({
        name: problemSolutionName,
        tags: { ProblemSolution },
    }),
    defineGlobalElement<ProblemAnswerSchema>()({
        name: problemAnswerName,
        tags: { ProblemAnswer },
    }),
    defineGlobalElement<ProblemCheckSchema>()({
        name: problemCheckName,
        tags: { ProblemCheck },
    }),
] as const;
