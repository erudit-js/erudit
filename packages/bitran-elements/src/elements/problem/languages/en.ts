import { defineLanguage } from '@bitran-js/renderer-vue';

import {
    createAttributePhrases,
    createLevelPhrases,
    type ProblemPhrases,
} from './phrases';

const levelPhrases = createLevelPhrases({
    easy: 'Elementary',
    medium: 'Intermediate',
    hard: 'Advanced',
});

const attributePhrases = createAttributePhrases({
    pretty: {
        title: 'Elegant',
        explain: 'This problem has an elegant and pretty solution.',
    },
    applied: {
        title: 'Applied',
        explain:
            'This problem makes practical sense in real life or useful in other subjects.',
    },
    method: {
        title: 'Method',
        explain:
            'This problem introduces a handy method or technique for solving similar problems.',
    },
    inter: {
        title: 'Inter-Subejct',
        explain: 'This problem connects different subjects or topics.',
    },
});

const english = defineLanguage<ProblemPhrases>({
    _element_title: 'Problem',
    level_hint: 'Level of mastery of material',
    action_hint: 'Hint',
    action_solution: 'Solution',
    action_answer: 'Answer',
    action_note: 'Note',
    action_generate: 'Similar',
    seed_explain:
        'Seed. It is used to calculate all random numbers in the problem.',
    ...levelPhrases,
    ...attributePhrases,
});

export default english;
