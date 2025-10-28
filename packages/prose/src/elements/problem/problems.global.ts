import {
    normalizeGeneratorUrl,
    problemGeneratorStorageKey,
    problemProps2Info,
    type ProblemInfo,
    type ProblemInfoProps,
    type ProblemStorage,
} from '.';
import {
    ensureBlockChild,
    ensureHasChildren,
    type RawChildren,
} from '../../children';
import type { JsxElement } from '../../element';
import { defineGlobalElement } from '../../globalElement';
import type { BlockSchemaAny, ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { validateProblemContent, type ProblemContentChild } from './content';
import type { ProblemGenerator } from './generator';

//
//
//

export const subProblemName = 'subProblem';

export type SubProblemSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof subProblemName;
    Linkable: false;
    Data: { label?: string; generatorPath?: string };
    Storage: ProblemStorage;
    Children: ProblemContentChild[];
}>;

export const SubProblem = defineTag('SubProblem')<
    SubProblemSchema,
    { label?: string } & (
        | { children: RawChildren; generator?: undefined }
        | { children?: undefined; generator: ProblemGenerator }
    )
>({
    type: ElementType.Block,
    name: subProblemName,
    linkable: false,
    initElement({ tagName, element, children, props }) {
        const label = props.label?.trim();
        element.data = {};

        if (label) {
            element.data.label = label;
        }

        if (props.generator) {
            element.data.generatorPath = normalizeGeneratorUrl(
                props.generator.url,
            );
            element.storageKey = problemGeneratorStorageKey(
                element.data.generatorPath,
            );
        } else {
            validateProblemContent(tagName, children);
            element.children = children as JsxElement<ProblemContentChild>[];
        }
    },
});

//
//
//

export const problemsName = 'problems';

export type ProblemsSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof problemsName;
    Linkable: true;
    Data: ProblemInfo;
    Storage: undefined;
    Children: BlockSchemaAny[];
}>;

export const Problems = defineTag('Problems')<
    ProblemsSchema,
    ProblemInfoProps & { children: RawChildren }
>({
    type: ElementType.Block,
    name: problemsName,
    linkable: true,
    initElement({ tagName, element, children, props }) {
        element.data = problemProps2Info(props);
        ensureHasChildren(tagName, children);
        const subProblems: JsxElement<SubProblemSchema>[] = [];
        const nonSubProblemChildren: JsxElement<BlockSchemaAny>[] = [];

        for (const child of children) {
            if (child.tagName === subProblemName) {
                subProblems.push(child as JsxElement<SubProblemSchema>);
            } else {
                ensureBlockChild(tagName, child);
                nonSubProblemChildren.push(child as JsxElement<BlockSchemaAny>);
            }
        }

        element.children = [...nonSubProblemChildren, ...subProblems];
    },
});

//
//
//

export default [
    defineGlobalElement<SubProblemSchema>()({
        name: subProblemName,
        tags: { SubProblem },
    }),
    defineGlobalElement<ProblemsSchema>()({
        name: problemsName,
        tags: { Problems },
    }),
] as const;
