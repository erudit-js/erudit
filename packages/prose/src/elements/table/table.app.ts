import { defineAppElement } from '../../app';
import { ElementType } from '../../type';
import { tableName, type TableSchema } from './table.global';

export default defineAppElement<TableSchema>({
    type: ElementType.Block,
    name: tableName,
    icon: () => import('./icon.svg?raw'),
    component: () => import('./Table.vue'),
    languages: {
        en: () => import('./languages/en'),
        ru: () => import('./languages/ru'),
    },
});
