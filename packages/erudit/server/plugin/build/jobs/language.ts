import { existsSync } from 'node:fs';

import { ERUDIT_DIR } from '#erudit/globalPaths';
import { stress } from '@erudit/utils/stress';
import { ERUDIT_SERVER } from '@server/global';
import { IMPORT } from '@server/importer';

export async function setupLanguage() {
    const languageCode = ERUDIT_SERVER.CONFIG?.language || 'en';
    const languageFilePath = ERUDIT_DIR + `/languages/${languageCode}.ts`;

    if (!existsSync(languageFilePath))
        throw new Error(`Language file for ${stress(languageCode)} not found!`);

    try {
        const languageModule = await IMPORT(languageFilePath);

        if (!languageModule.default)
            throw new Error(
                `Language file for ${stress(languageCode)} is missing default export with phrases!`,
            );

        const { default: phrases, ...context } = { ...languageModule };

        ERUDIT_SERVER.LANGUAGE = {
            phrases,
            functions: Object.entries(context)
                .filter(([, value]) => typeof value === 'function')
                .reduce((acc, [key, value]) => ({ ...acc, [key]: value }), {}),
        };
    } catch (error) {
        throw new Error(
            `Error while loading language ${stress(languageCode)}!\n\n${error}`,
        );
    }
}
