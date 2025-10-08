import { default as _appElements } from '#erudit/prose/app';

export const appElements = _appElements;

export function useAppElements() {
    for (const [name, element] of Object.entries(appElements)) {
        const languageCode = ERUDIT.config.project.language.current;
        if (!element.languages[languageCode]) {
            throw createError({
                statusCode: 500,
                statusMessage: `App element "${name}" does not support the current project language "${languageCode}"!`,
            });
        }
    }
}

export async function getElementIcon(elementName: string) {
    const appElement = getAppElement(elementName);
    return await appElement.icon();
}

function getAppElement(elementName: string) {
    const appElement = appElements[elementName];

    if (!appElement) {
        throw createError({
            statusCode: 500,
            statusMessage: `App element "${elementName}" not found! Make sure it is installed and configured correctly!`,
        });
    }

    return appElement;
}
