import {
    defineRegistryItem,
    defineSchema,
    ensureTagChildren,
    ProseError,
    type TagChildren,
} from '@jsprose/core';

import {
    constructProblemScriptId,
    problemScriptStrorageKey,
    type ProblemScript,
    type ProblemScriptStorage,
} from './problemScript.js';
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
import type { EruditRawElement } from '../../rawElement.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';

//
// SubProblem
//

export interface SubProblemData {
    label?: string;
    script?: string;
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
        | { script: ProblemScript; children?: undefined }
    )
>(({ element, tagName, props, children }) => {
    element.data = {};

    const label = props.label?.trim();
    if (label) {
        element.data.label = label;
    }

    if (props.script) {
        if (children) {
            throw new ProseError(
                `<${tagName}> cannot have both script and children in SubProblem element!`,
            );
        }

        element.data.script = constructProblemScriptId(
            props.script.scriptSrc,
            props.script.scriptName,
        );

        element.storageKey = problemScriptStrorageKey(props.script.scriptSrc);
    } else {
        validateProblemContent(tagName, children);
        element.children = children as EruditRawElement<ProblemContentChild>[];
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
    Children: (typeof subProblemSchema)[];
}>();

export const Problems = defineEruditTag({
    tagName: 'Problems',
    schema: problemsSchema,
})<ProblemInfoProps & TagChildren>(({ element, tagName, props, children }) => {
    ensureTagChildren(tagName, children, subProblemSchema);
    element.children = children;
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
