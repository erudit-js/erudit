import {
    normalizeGeneratorUrl,
    problemGeneratorStorageKey,
    problemProps2Info,
    type ProblemInfo,
    type ProblemInfoProps,
    type ProblemStorage,
} from '.';
import { validateProblemContent, type ProblemContentChild } from './content';
import type { ElementSchema } from '../../schema';
import { ElementType } from '../../type';
import { defineTag } from '../../tag';
import type { RawChildren } from '../../children';
import { defineGlobalElement, type JsxElement } from '../..';
import type { ProblemGenerator } from './generator';

export const problemName = 'problem';

export type ProblemSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof problemName;
    Linkable: true;
    Data: ProblemInfo & { generatorPath?: string };
    Storage: ProblemStorage;
    Children: ProblemContentChild[];
}>;

export const Problem = defineTag('Problem')<
    ProblemSchema,
    ProblemInfoProps &
        (
            | { generator?: undefined; children: RawChildren }
            | { generator: ProblemGenerator; children?: undefined }
        )
>({
    type: ElementType.Block,
    name: problemName,
    linkable: true,
    initElement({ tagName, element, props, children }) {
        element.data = problemProps2Info(props);
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

export default defineGlobalElement<ProblemSchema>()({
    name: problemName,
    tags: { Problem },
});
