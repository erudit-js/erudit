type PhraseCaller<T extends EruditPhraseId[]> = {
    [K in T[number]]: EruditPhrases[K];
};

const payloadKey = 'language';

interface LanguagePayload {
    strPhrases: Partial<Record<EruditPhraseId, string>>;
    strFunctions: Record<string, string>;
}

const functions: Record<string, Function> = {};
const functionPhrases: Record<string, Function> = {};

const phraseApiRoute = (phraseId: EruditPhraseId) =>
    `/api/language/phrase/${phraseId}`;
const functionsApiRoute = '/api/language/functions';
const phraseIdsApiRoute = '/api/language/phraseIds';

export function usePhrases<T extends EruditPhraseId[]>(
    ...phraseIds: T
): Promise<PhraseCaller<T>> {
    const nuxt = useNuxtApp();
    const payload: LanguagePayload =
        (nuxt.static.data[payloadKey] ||=
        nuxt.payload.data[payloadKey] ||=
            {});

    const prerenderAllPromise = prerenderAllPhrases();
    const prepareFunctionsPromise = prepareFunctions(payload);

    return (async () => {
        await prerenderAllPromise;
        await prepareFunctionsPromise;

        payload.strPhrases ||= {};
        const phraseCaller: any = {};

        for (const phraseId of phraseIds) {
            const apiRoute = phraseApiRoute(phraseId);
            const strPhrase = (payload.strPhrases[phraseId] ||= (await $fetch(
                apiRoute,
                { responseType: 'text' },
            )) as string);

            if (strPhrase.startsWith('~!~FUNC~!~')) {
                const strFunction = strPhrase.replace('~!~FUNC~!~', '');
                functionPhrases[phraseId] ||= new Function(strFunction).bind(
                    functions,
                )();
                phraseCaller[phraseId] = functionPhrases[phraseId];
            } else {
                phraseCaller[phraseId] = strPhrase;
            }
        }

        return phraseCaller as PhraseCaller<T>;
    })();
}

async function prerenderAllPhrases() {
    if (import.meta.dev) return;

    if (import.meta.client) return;

    const nuxt = useNuxtApp();

    const phraseIds = await $fetch(phraseIdsApiRoute);
    nuxt.runWithContext(() =>
        prerenderRoutes(phraseIds.map((phraseId) => phraseApiRoute(phraseId))),
    );
}

async function prepareFunctions(payload: LanguagePayload) {
    if (payload?.strFunctions) return;

    payload.strFunctions = await $fetch(functionsApiRoute);

    for (const [funcName, strFunc] of Object.entries(payload.strFunctions))
        functions[funcName] = new Function(strFunc)();
}
