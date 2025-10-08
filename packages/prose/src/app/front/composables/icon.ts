import { inject } from 'vue';

import { proseContextSymbol } from './appContext';

export function useIcon() {
    const { MaybeMyIcon } = inject(proseContextSymbol)!;
    return MaybeMyIcon;
}
