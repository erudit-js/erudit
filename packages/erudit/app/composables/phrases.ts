type PhraseCaller<T extends EruditPhraseId[]> = {
    [K in T[number]]: EruditPhrases[K];
};

const payloadKey = 'language';

interface LanguagePayload {
    strPhrases: Partial<Record<EruditPhraseId, string>>;
    strFunctions: Record<string, string>;
}

let functions: Record<string, Function>;
const functionPhrases: Record<string, Function> = {};

const phraseApiRoute = (phraseId: EruditPhraseId) =>
    `/api/language/phrase/${phraseId}`;
const functionsApiRoute = '/api/language/functions';

export function usePhrases<T extends EruditPhraseId[]>(
    ...phraseIds: T
): Promise<PhraseCaller<T>> {
    const nuxt = useNuxtApp();
    const payload: LanguagePayload =
        (nuxt.static.data[payloadKey] ||=
        nuxt.payload.data[payloadKey] ||=
            {});

    const prepareFunctionsPromise = prepareFunctions(payload);

    return (async () => {
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
                functionPhrases[phraseId] ||= new Function(
                    'funcs',
                    `
                    with(funcs) {
                        ${strFunction}
                    }
                `,
                )(functions);
                phraseCaller[phraseId] = functionPhrases[phraseId];
            } else {
                phraseCaller[phraseId] = strPhrase;
            }
        }

        return phraseCaller as PhraseCaller<T>;
    })();
}

async function prepareFunctions(payload: LanguagePayload) {
    payload.strFunctions ||= await $fetch(functionsApiRoute, {
        responseType: 'json',
    });

    functions ||= (() => {
        const _functions: Record<string, Function> = {};
        for (const [funcName, strFunc] of Object.entries(
            payload.strFunctions,
        )) {
            _functions[funcName] = new Function(strFunc)();
        }
        return _functions;
    })();
}
