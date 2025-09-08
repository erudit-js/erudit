import { defineAppElement } from '../../app';
import { ProseElementType } from '../../element';
import { listName, type ProseList } from './element.global';

export default defineAppElement<ProseList>({
    type: ProseElementType.Block,
    name: listName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./List.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
