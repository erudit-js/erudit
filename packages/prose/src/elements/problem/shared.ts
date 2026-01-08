//
// Problem Levels
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
// Problem Attributes
//

export const problemAttributes = [
    'pretty',
    'applied',
    'method',
    'inter',
] as const;

export type ProblemAttribute = (typeof problemAttributes)[number];

export interface ProblemCustomAttribute {
    label: string;
    icon?: string;
    hint?: string;
}

//
// Problem Actions
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

//
// Problem Info
//

export interface ProblemInfo {
    title: string;
    level: ProblemLevel;
    attributes: (ProblemAttribute | ProblemCustomAttribute)[];
}

export type ProblemInfoProps = {
    title: string;
    level: ProblemLevel;
    attributes?: (ProblemAttribute | ProblemCustomAttribute)[];
} & AttributeProps;

type AttributeProps = {
    [K in ProblemAttribute]?: true;
};

export function problemProps2Info(props: ProblemInfoProps): ProblemInfo {
    return {
        title: props.title,
        level: props.level,
        attributes: [
            ...problemAttributes.filter((attr) => props[attr] === true),
            ...(props.attributes ?? []),
        ],
    };
}
