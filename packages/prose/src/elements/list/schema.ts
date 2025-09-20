import type { ElementSchema, ElementSchemaAny } from '../../schema';
import type { ElementType } from '../../type';

//
// List Item
//

export const listItemName = 'listItem';

export type ListItemSchema = ElementSchema<
    ElementType.Block,
    typeof listItemName,
    ElementType,
    undefined,
    ElementSchemaAny[]
>;

//
// List
//

export const listName = 'list';

export type ListSchema = ElementSchema<
    ElementType.Block,
    typeof listName,
    { type: 'ordered'; start?: number } | { type: 'unordered' },
    undefined,
    ListItemSchema[]
>;
