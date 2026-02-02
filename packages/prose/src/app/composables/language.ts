import type { AnySchema, ProseElement } from '@jsprose/core';

import type { ElementPhrases } from '../language/element.js';
import { proseLanguages } from '../language/prose.js';
import { useProseContext } from './context.js';
import { useAppElement } from './appElement.js';

export async function useProseLanguage() {
  const { languageCode } = useProseContext();
  return (await proseLanguages[languageCode]()).default;
}

export async function useElementPhrase<TPhrases extends ElementPhrases>(
  schemaName: string,
): Promise<TPhrases>;
export async function useElementPhrase<TPhrases extends ElementPhrases>(
  element: ProseElement<AnySchema>,
): Promise<TPhrases>;
export async function useElementPhrase<TPhrases extends ElementPhrases>(
  elementOrName: string | ProseElement<AnySchema>,
): Promise<TPhrases> {
  const { languageCode } = useProseContext();
  const appElement = useAppElement(
    typeof elementOrName === 'string'
      ? elementOrName
      : elementOrName.schemaName,
  );
  const languages = appElement.languages;
  return (await languages[languageCode]()) as TPhrases;
}
