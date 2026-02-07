import { defineElementLanguage } from '../../../../app/language/element.js';
import type { ProblemPhrases } from '../../phrases.js';
import ru from '../shared/ru.js';

export default defineElementLanguage<ProblemPhrases>({
  ...ru,
  element_name: 'Задачи',
});
