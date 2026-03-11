import type { FormatText } from '@erudit-js/core/formatText';
import { createFormatTextFn } from '../../shared/utils/formatText';

export let formatText: FormatText;

export async function initFormatText() {
  const languageCode = ERUDIT.config.language.current;
  formatText = createFormatTextFn(languageCode);
}
