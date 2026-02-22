import { appElements } from '#erudit/prose/app';
export { appElements } from '#erudit/prose/app';

export async function initAppElements() {
  for (const [name, element] of Object.entries(appElements)) {
    const languageCode = ERUDIT.config.language.current;
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

export async function getElementPhrase(elementName: string) {
  const appElement = getAppElement(elementName);
  const languageCode = ERUDIT.config.language.current;
  return await appElement.languages[languageCode]!();
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
