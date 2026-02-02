import { inject, type InjectionKey } from 'vue';
import type { FormatTextState } from '@erudit-js/core/formatText';

import { useProseContext } from './context.js';

export function useFormatText() {
  const { formatText } = useProseContext();
  return formatText;
}

export const formatTextStateSymbol = Symbol() as InjectionKey<FormatTextState>;

export function useFormatTextState() {
  return inject(formatTextStateSymbol)!;
}
