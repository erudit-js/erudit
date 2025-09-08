import { ProseElementType } from '../../element';

export type ElementIconRaw = () => Promise<{ default: string }>;
export type ElementIcon = () => Promise<string>;

export function resolveElementIcon(
    type: ProseElementType,
    iconModule?: ElementIconRaw,
) {
    iconModule ??=
        type === ProseElementType.Block
            ? () => import('../icons/block.svg?raw')
            : () => import('../icons/inline.svg?raw');

    return async () => (await iconModule()).default;
}
