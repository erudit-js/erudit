import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { problemName, type ProblemSchema } from './problem.global';

export default defineAppElement<ProblemSchema>({
    type: ElementType.Block,
    name: problemName,
    icon: () => import('./assets/icon.svg?raw'),
    component: () => import('./components/Problem.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
