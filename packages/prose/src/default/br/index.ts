import { ProseError } from '../../error';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';

export const brName = 'br';

export type BrSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof brName;
    Linkable: false;
    Data: undefined;
    Storage: undefined;
    Children: undefined;
}>;

export const Br = defineTag(brName)<BrSchema, { children?: undefined }>({
    type: ElementType.Inliner,
    name: brName,
    linkable: false,
    initElement() {},
    childStep({ tagName, child }) {
        throw new ProseError(
            `<${tagName}> cannot have children, but detected <${child.tagName}>!`,
        );
    },
});
