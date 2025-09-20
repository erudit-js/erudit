import { defineGlobalElement } from '../../global';
import { listName, type ListSchema } from './schema';
import { Ol, Ul } from './tags';

export default defineGlobalElement<ListSchema>()({
    name: listName,
    tags: { Ol, Ul },
});
