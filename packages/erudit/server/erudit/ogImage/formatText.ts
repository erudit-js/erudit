import type { FormatText } from '@erudit-js/core/formatText';
import { createFormatTextFn } from '../../../shared/utils/formatText';

let _ogFormatText: FormatText | undefined;

export function ogFormatText(text: string): string {
  if (!_ogFormatText) {
    const languageCode = ERUDIT.config.public.language.current;
    _ogFormatText = createFormatTextFn(languageCode);
  }
  return _ogFormatText(text);
}
