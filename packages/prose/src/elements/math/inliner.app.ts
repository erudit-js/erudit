import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { inlinerMathName, type InlinerMathSchema } from './inliner';

export default defineAppElement<InlinerMathSchema>({
    type: ElementType.Inliner,
    name: inlinerMathName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./components/InlinerMath.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
