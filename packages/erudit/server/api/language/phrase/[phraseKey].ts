export default defineEventHandler<Promise<PayloadLanguagePhraseValue>>(
    async (event) => {
        const phraseKey = event.context.params?.phraseKey;

        if (!phraseKey) {
            throw createError({
                statusCode: 400,
                message: 'Phrase key is required!',
            });
        }

        let phraseValue = ERUDIT.language.phrases[phraseKey];

        if (phraseValue) {
            if (typeof phraseValue === 'string') {
                return {
                    type: 'string',
                    value: phraseValue,
                };
            } else {
                return {
                    type: 'function',
                    value: phraseValue.toString(),
                };
            }
        }

        return {
            type: 'missing',
        };
    },
);
