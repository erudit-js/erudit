import type { ProblemPhrases } from '..';
import { useProseAppContext } from '../../../app';
import { problemName } from '../problem.global';

export async function useProblemPhrase(): Promise<ProblemPhrases> {
    const { appElements, languageCode } = useProseAppContext();
    const problemAppElement = appElements[problemName];
    return (await problemAppElement.languages[
        languageCode
    ]()) as ProblemPhrases;
}
