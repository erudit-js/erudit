import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { listName, type ListSchema } from './element.global';

export default defineAppElement<ListSchema>({
    type: ElementType.Block,
    name: listName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./List.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
