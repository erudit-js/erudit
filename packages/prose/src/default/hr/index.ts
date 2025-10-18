import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const hrName = 'hr';

export type HrSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof hrName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: undefined;
}>;

export const Hr = defineTag('hr')<HrSchema, { children?: undefined }>({
    type: ElementType.Block,
    name: hrName,
    linkable: false,
    initElement() {},
});
