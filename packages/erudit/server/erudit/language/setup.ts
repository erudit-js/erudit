import { serverLanguages } from './list';

export async function setupServerLanguage() {
    ERUDIT.language = {
        phrases: {} as any,
        functions: {},
    };

    try {
        const targetLanguage = ERUDIT.config.public.language.current;

        if (!targetLanguage.trim()) {
            throw new Error('No language specified in Erudit config!');
        }

        if (!(targetLanguage in serverLanguages)) {
            throw new Error(`Language ${targetLanguage} is not supported!`);
        }

        const languageModule = await serverLanguages[targetLanguage]();

        ERUDIT.language.phrases = languageModule.phrases;

        for (const [funcKey, funcValue] of Object.entries(languageModule)) {
            if (typeof funcValue === 'function') {
                ERUDIT.language.functions[funcKey] = funcValue;
            }
        }

        ERUDIT.log.success(
            `Language "${ERUDIT.log.stress(targetLanguage)}" setup complete!`,
        );
    } catch (error) {
        ERUDIT.log.error(`Failed to setup server language:\n${error}`);
    }
}
