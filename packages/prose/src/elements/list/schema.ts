import type { ElementSchema, ElementSchemaAny } from '../../schema';
import type { ElementType } from '../../type';

//
// List Item
//

export const listItemName = 'listItem';

export type ListItemSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof listItemName;
    Linkable: false;
    Data: ElementType;
    Storage: undefined;
    Children: ElementSchemaAny[];
}>;

//
// List
//

export const listName = 'list';

export type ListSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof listName;
    Linkable: true;
    Data: { type: 'ordered'; start?: number } | { type: 'unordered' };
    Storage: undefined;
    Children: ListItemSchema[];
}>;
