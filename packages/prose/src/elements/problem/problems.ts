import {
    defineRegistryItem,
    defineSchema,
    ensureTagBlockChildren,
    isRawElement,
    ProseError,
    type AnyUnique,
    type BlockSchema,
    type RawElement,
    type TagChildren,
} from '@jsprose/core';

import {
    validateProblemContent,
    type ProblemContentChild,
} from './problemContent.js';
import { defineEruditTag } from '../../tag.js';
import {
    problemProps2Info,
    type ProblemInfo,
    type ProblemInfoProps,
} from './shared.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';
import {
    problemScriptStorageKey,
    type ProblemScriptStorage,
} from './storage.js';
import { type ProblemScriptInstance } from './problemScript.js';

//
// SubProblem
//

export interface SubProblemData {
    label?: string;
    scriptUniques?: Record<string, AnyUnique>;
}

export const subProblemSchema = defineSchema({
    name: 'subProblem',
    type: 'block',
    linkable: false,
})<{
    Data: SubProblemData;
    Storage: ProblemScriptStorage;
    Children: ProblemContentChild[];
}>();

export const SubProblem = defineEruditTag({
    tagName: 'SubProblem',
    schema: subProblemSchema,
})<
    { label?: string } & (
        | { children: {}; script?: undefined }
        | { script: ProblemScriptInstance; children?: undefined }
    )
>(({ element, tagName, props, children }) => {
    element.data = {};

    const label = props.label?.trim();
    if (label) {
        element.data.label = label;
    }

    if (props.script && children) {
        throw new ProseError(
            `<${tagName}> cannot have both script and children!`,
        );
    }

    if (props.script) {
        element.data.scriptUniques = props.script.uniques;

        element.storageKey = problemScriptStorageKey(props.script.scriptSrc);

        element.children = props.script.generate().problemContent;
    } else {
        validateProblemContent(tagName, children);
        element.children = children as any;
    }
});

export const subProblemRegistryItem = defineRegistryItem({
    schema: subProblemSchema,
    tags: [SubProblem],
});

export const subProblemCoreElement = defineEruditProseCoreElement({
    registryItem: subProblemRegistryItem,
});

//
// Problems
//

export const problemsSchema = defineSchema({
    name: 'problems',
    type: 'block',
    linkable: true,
})<{
    Data: ProblemInfo;
    Storage: undefined;
    Children: (typeof subProblemSchema | BlockSchema)[];
}>();

export const Problems = defineEruditTag({
    tagName: 'Problems',
    schema: problemsSchema,
})<ProblemInfoProps & TagChildren>(({
    element,
    tagName,
    props,
    children,
    registry,
}) => {
    ensureTagBlockChildren(tagName, children, registry);

    const subProblemChildren: RawElement<typeof subProblemSchema>[] = [];
    const otherChildren: RawElement<BlockSchema>[] = [];

    for (const child of children) {
        if (isRawElement(child, subProblemSchema)) {
            subProblemChildren.push(child);
        } else {
            otherChildren.push(child);
        }
    }

    if (subProblemChildren.length === 0) {
        throw new ProseError(
            `<${tagName}> must have at least one <SubProblem> child!`,
        );
    }

    element.children = [...otherChildren, ...subProblemChildren];
    element.data = problemProps2Info(props);
    element.title = element.data.title;
    element.snippet = { search: true };
    element.toc = { add: true };
});

export const problemsRegistryItem = defineRegistryItem({
    schema: problemsSchema,
    tags: [Problems],
});

export const problemsCoreElement = defineEruditProseCoreElement({
    registryItem: problemsRegistryItem,
});
