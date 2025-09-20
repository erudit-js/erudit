import { defineGlobalElement } from '../../global';
import { type ListItemSchema, listItemName } from './schema';
import { Li } from './tags';

export default defineGlobalElement<ListItemSchema>()({
    name: listItemName,
    tags: { Li },
});
