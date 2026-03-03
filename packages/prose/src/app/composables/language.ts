import type { ProseElement } from 'tsprose';

import type { ElementPhrases } from '../language/element.js';
import { proseLanguages, type ProsePhrases } from '../language/prose.js';
import { useProseContext } from './context.js';
import { useAppElement } from './appElement.js';

const proseLanguageCache = new Map<string, Promise<ProsePhrases>>();

export function useProseLanguage(): Promise<ProsePhrases> {
  const { languageCode } = useProseContext();
  if (!proseLanguageCache.has(languageCode)) {
    proseLanguageCache.set(
      languageCode,
      proseLanguages[languageCode]().then((m) => m.default),
    );
  }
  return proseLanguageCache.get(languageCode)!;
}

export async function useElementPhrase<TPhrases extends ElementPhrases>(
  schemaName: string,
): Promise<TPhrases>;
export async function useElementPhrase<TPhrases extends ElementPhrases>(
  element: ProseElement,
): Promise<TPhrases>;
export async function useElementPhrase<TPhrases extends ElementPhrases>(
  elementOrName: string | ProseElement,
): Promise<TPhrases> {
  const { languageCode } = useProseContext();
  const appElement = useAppElement(
    typeof elementOrName === 'string'
      ? elementOrName
      : elementOrName.schema.name,
  );
  const languages = appElement.languages;
  return (await languages[languageCode]()) as TPhrases;
}
