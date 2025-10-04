import { inject } from 'vue';

import { proseContextSymbol } from './appContext';

export function useFormatText() {
    const { formatText } = inject(proseContextSymbol)!;
    return formatText;
}
