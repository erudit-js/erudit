import { defineElementLanguage } from '../../../../app/language/element.js';
import type { ProblemPhrases } from '../../phrases.js';
import en from '../shared/en.js';

export default defineElementLanguage<ProblemPhrases>({
  ...en,
  element_name: 'Problem',
});
