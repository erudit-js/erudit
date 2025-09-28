export enum AsideType {
    Major = 'major',
    Minor = 'minor',
}

export interface AsideState {
    opened: AsideType | undefined;
    scrolledUp: boolean;
}

export const asideTypeSymbol = Symbol() as InjectionKey<AsideType>;

export const useAsideState = () => {
    return useState<AsideState>('aside-state', () => ({
        opened: undefined,
        scrolledUp: true,
    }));
};

export const useCanShowAsideSwitches = () => {
    const asideState = useAsideState();
    const { previewState } = usePreview();
    return computed(() => {
        const noOpenedAsides = !asideState.value.opened;
        const scrolledUp = asideState.value.scrolledUp;
        return noOpenedAsides && scrolledUp && !previewState.value.opened;
    });
};
