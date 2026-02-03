import { useProseContext } from '../../../app/composables/context.js';
import type { ProblemPhrases } from '../phrases.js';
import { problemSchema } from '../problem.js';

export async function useProblemPhrase(): Promise<ProblemPhrases> {
  const { appElements, languageCode } = useProseContext();
  const problemAppElement = appElements[problemSchema.name];
  return (await problemAppElement.languages[languageCode]()) as ProblemPhrases;
}
