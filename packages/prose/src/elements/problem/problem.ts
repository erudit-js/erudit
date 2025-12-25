import {
    defineRegistryItem,
    defineSchema,
    ProseError,
    type AnyUnique,
} from '@jsprose/core';

import {
    problemProps2Info,
    type ProblemInfo,
    type ProblemInfoProps,
} from './shared.js';
import {
    validateProblemContent,
    type ProblemContentChild,
} from './problemContent.js';
import { defineEruditTag } from '../../tag.js';
import { defineEruditProseCoreElement } from '../../coreElement.js';
import {
    problemScriptStorageKey,
    type ProblemScriptStorage,
} from './storage.js';
import {
    stringifyProblemScriptId,
    type ProblemScriptInstance,
} from './problemScript.js';

export interface ProblemData {
    info: ProblemInfo;
    scriptUniques?: Record<string, AnyUnique>;
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
            | { script: ProblemScriptInstance; children?: undefined }
        )
>(({ element, tagName, props, children }) => {
    element.data = { info: problemProps2Info(props) };

    element.title = element.data.info.title;
    element.snippet = { search: true };
    element.toc = { add: true };

    if (children && props.script) {
        throw new ProseError(
            `<${tagName}> cannot have both script and children in Problem element!`,
        );
    }

    if (props.script) {
        element.data.scriptUniques = props.script.uniques;

        element.storageKey = problemScriptStorageKey(
            stringifyProblemScriptId(
                props.script.scriptSrc,
                props.script.exportName,
            ),
        );

        element.children = props.script.generate().problemContent;
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
