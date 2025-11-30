export type ElementIconRaw = () => Promise<{ default: string }>;
export type ElementIcon = () => Promise<string>;

export function resolveElementIcon(
    isBlock: boolean,
    rawIcon?: ElementIconRaw,
): ElementIcon {
    const iconLoader =
        (rawIcon ?? isBlock)
            ? () => import('./shared/assets/block.svg?raw')
            : () => import('./shared/assets/inliner.svg?raw');

    return async () => {
        const iconModule = await iconLoader();
        return iconModule.default;
    };
}
