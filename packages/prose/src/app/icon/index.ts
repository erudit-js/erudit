import { ElementType } from '../../type';

export type ElementIconRaw = () => Promise<{ default: string }>;
export type ElementIcon = () => Promise<string>;

export function resolveElementIcon(
    type: ElementType,
    iconModule?: ElementIconRaw,
) {
    iconModule ??=
        type === ElementType.Block
            ? () => import('./block.svg?raw')
            : () => import('./inliner.svg?raw');

    return async () => (await iconModule()).default;
}
