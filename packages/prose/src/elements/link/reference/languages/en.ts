import { defineElementLanguage } from '../../../../app/language/element.js';
import type { ReferencePhrases } from '../phrases.js';

export default defineElementLanguage<ReferencePhrases>({
  element_name: 'Reference',
  external_link: 'External link',
  broken_link: 'Broken link',
});
