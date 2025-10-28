import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { problemsName, type ProblemsSchema } from './problems.global';

export default defineAppElement<ProblemsSchema>({
    type: ElementType.Block,
    name: problemsName,
    icon: () => import('./assets/icon.svg?raw'),
    component: () => import('./components/Problems.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
