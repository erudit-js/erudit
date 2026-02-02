/** Allows different `formatText()` calls to share state. */
export interface FormatTextState {
  quote: 'opened' | 'closed';
}

export function createFormatTextState(): FormatTextState {
  return {
    quote: 'closed',
  };
}

export interface FormatText {
  (text: string, state?: FormatTextState): string;
  (text: undefined, state?: FormatTextState): undefined;
  (text?: string, state?: FormatTextState): string | undefined;
}
