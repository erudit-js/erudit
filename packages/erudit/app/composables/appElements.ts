import { default as _appElements } from '#erudit/prose/app';

export const appElements = _appElements;

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
