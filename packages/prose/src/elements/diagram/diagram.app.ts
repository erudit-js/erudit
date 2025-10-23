import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { diagramName, type DiagramSchema } from './diagram.global';

export default defineAppElement<DiagramSchema>({
    type: ElementType.Block,
    name: diagramName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Diagram.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
