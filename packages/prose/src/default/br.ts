import { ProseError } from '../error';
import { PropsMode } from '../props';
import type { ElementSchema } from '../schema';
import { defineTag } from '../tag';
import { ElementType } from '../type';

export const brName = 'br';

export type BrSchema = ElementSchema<
    ElementType.Inliner,
    typeof brName,
    undefined,
    undefined,
    undefined
>;

export const Br = defineTag(
    brName,
    PropsMode.Custom,
)<BrSchema, { children?: undefined }>({
    type: ElementType.Inliner,
    name: brName,
    dataChildren() {
        return {
            data: undefined,
            children: undefined,
        };
    },
    childStep({ tagName, child }) {
        throw new ProseError(
            `<${tagName}> cannot have children, but detected <${child.tagName}>!`,
        );
    },
});
