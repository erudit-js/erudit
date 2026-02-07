import { defineElementLanguage } from '../../../../app/language/element.js';
import type { ReferencePhrases } from '../phrases.js';

export default defineElementLanguage<ReferencePhrases>({
  element_name: 'Ссылка',
  external_link: 'Внешняя ссылка',
  broken_link: 'Неработающая ссылка',
});
