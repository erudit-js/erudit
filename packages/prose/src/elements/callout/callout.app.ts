import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { calloutName, type CalloutSchema } from './callout.global';

export default defineAppElement<CalloutSchema>({
    type: ElementType.Block,
    name: calloutName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Callout.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
