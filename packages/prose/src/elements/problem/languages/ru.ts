import type { ProblemPhrases } from '..';
import { defineElementLanguage } from '../../../app';

export default defineElementLanguage<ProblemPhrases>({
    element_name: 'Задача',
    'level.example': 'Пример',
    'level.easy': 'Ликбез',
    'level.medium': 'Нормальный',
    'level.hard': 'Продвинутый',
    'attribute.pretty': 'Красивая',
    'attribute_explain.pretty':
        'Эта задача имеет элегантное и красивое решение.',
    'attribute.applied': 'Прикладная',
    'attribute_explain.applied':
        'Эта задача имеет практический смысл в реальной жизни или полезна в других предметах.',
    'attribute.method': 'Прием',
    'attribute_explain.method':
        'Эта задача вводит полезный метод или технику для решения аналогичных задач.',
    'attribute.inter': 'Межпредметная',
    'attribute_explain.inter':
        'Эта задача объединяет разные предметы или темы.',
    level_hint: 'Уровень владения материалом',
    action_hint: 'Подсказка',
    action_solution: 'Решение',
    action_answer: 'Ответ',
    action_note: 'Примечание',
    action_generate: 'Аналог',
    seed_explain:
        'Зерно. От него высчитываются все случайные числа в задаче. То же зерно = те же числа.',
});
