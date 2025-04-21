import { type ProblemAtrribute, type ProblemLevel } from '../shared';

type LevelPhrases = {
    [K in `level.${ProblemLevel}`]: string;
};

type AttributePhrases = {
    [K in
        | `attribute.${ProblemAtrribute}`
        | `attribute_explain.${ProblemAtrribute}`]: string;
};

type GeneralPhrases = {
    level_hint: string;
    action_hint: string;
    action_solution: string;
    action_answer: string;
    action_note: string;
    action_generate: string;
    seed_explain: string;
};

export type ProblemPhrases = LevelPhrases & AttributePhrases & GeneralPhrases;

//
// Helpers
//

export function createLevelPhrases(phrases: Record<ProblemLevel, string>) {
    return Object.fromEntries(
        Object.entries(phrases).map(([key, value]) => [`level.${key}`, value]),
    ) as LevelPhrases;
}

export function createAttributePhrases(
    phrases: Record<
        ProblemAtrribute,
        {
            title: string;
            explain: string;
        }
    >,
) {
    return Object.fromEntries(
        Object.entries(phrases).flatMap(([key, value]) => {
            const result: [string, string][] = [
                [`attribute.${key}`, value.title],
                [`attribute_explain.${key}`, value.explain],
            ];

            return result;
        }),
    ) as AttributePhrases;
}
