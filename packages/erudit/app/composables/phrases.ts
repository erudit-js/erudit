type PayloadLanguage = {
  phrases: Partial<Record<LanguagePhraseKey, PayloadLanguagePhraseValue>>;
  functions?: Record<string, string>;
};

type PhraseCaller<T extends readonly LanguagePhraseKey[]> = {
  [K in T[number]]: LanguagePhrases[K];
};

const initialPayloadLanguage = {
  phrases: {},
  functions: undefined,
};

//
// "functions" and "phrases" exist both on server and client side
// On server side they serve as module-cache
// On client side they act as singletons for whole Nuxt App
// This is okay because language can't be changed after server initialization
//

let functions: Record<string, Function> | undefined = undefined;
const phrases: Partial<LanguagePhrases> = {};

export function usePhrases<const T extends readonly LanguagePhraseKey[]>(
  ...phraseKeys: T
): Promise<PhraseCaller<T>> {
  const nuxtApp = useNuxtApp();
  const payloadKey = 'raw-language';
  const payloadLanguage: PayloadLanguage =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
      initialPayloadLanguage);

  const ensureFunctionsInPayload = async () => {
    if (payloadLanguage.functions) {
      return;
    }

    const strFunctions = await $fetch<Record<string, string>>(
      '/api/language/functions',
    );

    payloadLanguage.functions = strFunctions;
  };

  const restoreFunctionsFromPayload = async () => {
    if (functions) {
      return;
    }

    functions = {};
    for (const [funcName, funcBody] of Object.entries(
      payloadLanguage.functions!,
    )) {
      functions[funcName] = new Function('return ' + funcBody)();
    }
  };

  const processPhrase = async (phraseKey: LanguagePhraseKey) => {
    const phraseInPayload = payloadLanguage.phrases[phraseKey];
    const phraseRestored = phrases[phraseKey];

    let payloadPhraseValue: PayloadLanguagePhraseValue;

    if (phraseInPayload) {
      payloadPhraseValue = phraseInPayload;
    } else {
      try {
        payloadPhraseValue = await $fetch<PayloadLanguagePhraseValue>(
          `/api/language/phrase/${phraseKey}`,
          {
            responseType: 'json',
          },
        );

        payloadLanguage.phrases[phraseKey] = payloadPhraseValue;
      } catch {
        throw createError({
          statusCode: 503,
          statusMessage: 'Service Unavailable',
          message: `Failed to fetch phrase "${phraseKey}"!`,
        });
      }
    }

    if (payloadPhraseValue.type === 'missing') {
      throw createError({
        statusCode: 404,
        statusMessage: 'Unknown phrase!',
        message: `There is no phrase with key "${phraseKey}"!`,
      });
    }

    if (phraseRestored) {
      return;
    }

    switch (payloadPhraseValue.type) {
      case 'string':
        phrases[phraseKey] = payloadPhraseValue.value as any;
        break;
      case 'function':
        phrases[phraseKey] = new Function(
          'funcs',
          `
                            with (funcs) {
                                return ${payloadPhraseValue.value};
                            }
                        `,
        )(functions!);
        break;
    }
  };

  return Promise.resolve()
    .then(ensureFunctionsInPayload)
    .then(restoreFunctionsFromPayload)
    .then(() =>
      phraseKeys.reduce<Promise<void>>(
        (p, key) => p.then(() => processPhrase(key)),
        Promise.resolve(),
      ),
    )
    .then(() => phrases as PhraseCaller<T>);
}
