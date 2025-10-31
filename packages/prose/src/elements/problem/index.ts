import type { ElementPhrases } from '../../app';
import { isElement } from '../../element';
import {
    ProblemAnswer,
    ProblemCheck,
    ProblemHint,
    ProblemNote,
    ProblemSolution,
} from './content';

//
//
//

export const problemLevels = ['example', 'easy', 'medium', 'hard'] as const;

export type ProblemLevel = (typeof problemLevels)[number];

export function isProblemLevel(value: unknown): value is ProblemLevel {
    return (
        typeof value === 'string' &&
        problemLevels.includes(value as ProblemLevel)
    );
}

//
//
//

export const problemAttributes = [
    'pretty',
    'applied',
    'method',
    'inter',
] as const;

export type ProblemAttribute = (typeof problemAttributes)[number];

export function isProblemAttribute(value: unknown): value is ProblemAttribute {
    return (
        typeof value === 'string' &&
        problemAttributes.includes(value as ProblemAttribute)
    );
}

//
//
//

export const problemActions = [
    'hint',
    'answer',
    'solution',
    'note',
    'check',
    'generate',
] as const;

export type ProblemAction = (typeof problemActions)[number];

export function isProblemAction(value: unknown): value is ProblemAction {
    return (
        typeof value === 'string' &&
        problemActions.includes(value as ProblemAction)
    );
}

export function isProblemActionElement(element: any, action: ProblemAction) {
    switch (action) {
        case 'answer':
            return isElement(element, ProblemAnswer);
        case 'check':
            return isElement(element, ProblemCheck);
        case 'hint':
            return isElement(element, ProblemHint);
        case 'solution':
            return isElement(element, ProblemSolution);
        case 'note':
            return isElement(element, ProblemNote);
    }
}

//
//
//

export type ProblemPhrases = ElementPhrases<
    {
        [K in `level.${ProblemLevel}`]: string;
    } & {
        [K in
            | `attribute.${ProblemAttribute}`
            | `attribute_explain.${ProblemAttribute}`]: string;
    } & {
        level_hint: string;
        action_hint: string;
        action_solution: string;
        action_answer: string;
        action_note: string;
        action_check: string;
        action_generate: string;
        seed_explain: string;
    }
>;

//
//
//

export interface ProblemInfo {
    title: string;
    level: ProblemLevel;
    attributes: ProblemAttribute[];
}

export type ProblemInfoProps = {
    title: string;
    level: ProblemLevel;
} & AttributeProps;

type AttributeProps = {
    [K in ProblemAttribute]?: true;
};

export function problemProps2Info(props: ProblemInfoProps): ProblemInfo {
    return {
        title: props.title,
        level: props.level,
        attributes: problemAttributes.filter((attr) => props[attr] === true),
    };
}

//
//
//

export type ProblemStorage =
    | {
          generatorUrl: string;
      }
    | undefined;

export function normalizeGeneratorUrl(url: string): string {
    return url.replace(/^file:\/\/\/*/, '').replace(/\\/g, '/');
}

export function problemGeneratorStorageKey(generatorPath: string): string {
    return 'problemGenerator: ' + generatorPath;
}
