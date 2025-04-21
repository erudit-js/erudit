import { defineLanguage } from '@bitran-js/renderer-vue';

import {
    createAttributePhrases,
    createLevelPhrases,
    type ProblemPhrases,
} from './phrases';

const levelPhrases = createLevelPhrases({
    easy: 'Ликбез',
    medium: 'Нормальный',
    hard: 'Продвинутый',
});

const attributePhrases = createAttributePhrases({
    pretty: {
        title: 'Красивая',
        explain: 'Эта задача имеет элегантное и красивое решение.',
    },
    applied: {
        title: 'Прикладная',
        explain:
            'Эта задача имеет практический смысл в реальной жизни или полезна в других предметах.',
    },
    method: {
        title: 'Прием',
        explain:
            'Эта задача вводит полезный метод или технику для решения аналогичных задач.',
    },
    inter: {
        title: 'Межпредметная',
        explain: 'Эта задача объединяет разные предметы или темы.',
    },
});

const russian = defineLanguage<ProblemPhrases>({
    _element_title: 'Задача',
    level_hint: 'Уровень владения материалом',
    action_hint: 'Подсказка',
    action_solution: 'Решение',
    action_answer: 'Ответ',
    action_note: 'Примечание',
    action_generate: 'Аналог',
    seed_explain: 'Зерно. От него высчитываются все случайные числа в задаче.',
    ...levelPhrases,
    ...attributePhrases,
});

export default russian;
