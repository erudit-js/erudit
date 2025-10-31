import type { ProblemPhrases } from '..';
import { defineElementLanguage } from '../../../app';

export default defineElementLanguage<ProblemPhrases>({
    element_name: 'Problem',
    'level.example': 'Example',
    'level.easy': 'Elementary',
    'level.medium': 'Intermediate',
    'level.hard': 'Advanced',
    'attribute.pretty': 'Elegant',
    'attribute_explain.pretty':
        'This problem has an elegant and pretty solution.',
    'attribute.applied': 'Applied',
    'attribute_explain.applied':
        'This problem makes practical sense in real life or useful in other subjects.',
    'attribute.method': 'Method',
    'attribute_explain.method':
        'This problem introduces a handy method or technique for solving similar problems.',
    'attribute.inter': 'Inter-Subject',
    'attribute_explain.inter':
        'This problem connects different subjects or topics.',
    level_hint: 'Level of mastery of material',
    action_hint: 'Hint',
    action_solution: 'Solution',
    action_answer: 'Answer',
    action_note: 'Note',
    action_check: 'Check',
    action_generate: 'Similar',
    seed_explain:
        'Seed to calculate all random numbers in the problem. Same seed = same numbers.',
});
