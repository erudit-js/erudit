import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { paragraphName, type ParagraphSchema } from '.';

export default defineAppElement<ParagraphSchema>({
    type: ElementType.Block,
    name: paragraphName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Paragraph.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
