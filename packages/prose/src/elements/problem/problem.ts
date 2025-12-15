import { defineRegistryItem, defineSchema, ProseError } from '@jsprose/core';

import {
    problemProps2Info,
    type ProblemInfo,
    type ProblemInfoProps,
} from './shared.js';
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
import { defineEruditProseCoreElement } from '../../coreElement.js';

export interface ProblemData {
    info: ProblemInfo;
    script?: string;
}

export const problemSchema = defineSchema({
    name: 'problem',
    type: 'block',
    linkable: true,
})<{
    Data: ProblemData;
    Storage: ProblemScriptStorage;
    Children: ProblemContentChild[];
}>();

export const Problem = defineEruditTag({
    tagName: 'Problem',
    schema: problemSchema,
})<
    ProblemInfoProps &
        (
            | { children: {}; script?: undefined }
            | { script: ProblemScript; children?: undefined }
        )
>(({ element, tagName, props, children }) => {
    element.data = { info: problemProps2Info(props) };

    element.title = element.data.info.title;
    element.snippet = { search: true };
    element.toc = { add: true };

    if (props.script) {
        if (children) {
            throw new ProseError(
                `<${tagName}> cannot have both script and children in Problem element!`,
            );
        }

        element.data.script = constructProblemScriptId(
            props.script.scriptSrc,
            props.script.scriptName,
        );

        element.storageKey = problemScriptStrorageKey(props.script.scriptSrc);

        const generatedChildren = props.script.createProblemContent(123, {
            language: 'en',
            linkable: true,
        }) as any;

        console.log(generatedChildren);

        validateProblemContent(tagName, generatedChildren.children);
        element.children = generatedChildren.children;
    } else {
        validateProblemContent(tagName, children);
        element.children = children as any;
    }
});

export const problemRegistryItem = defineRegistryItem({
    schema: problemSchema,
    tags: [Problem],
});

export const problemCoreElement = defineEruditProseCoreElement({
    registryItem: problemRegistryItem,
});
