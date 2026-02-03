import type { Nuxt } from 'nuxt/schema';
import { addTemplate } from 'nuxt/kit';

import type { ElementData } from './shared';

export function createAppTemplate(nuxt: Nuxt, elementsData: ElementData[]) {
  const defaultImportName = (elementName: string) => `app_${elementName}`;

  const apps: Record<string, string> = {};

  for (const elementData of elementsData) {
    if (elementData.absAppPath) {
      apps[defaultImportName(elementData.name)] = elementData.absAppPath;
    }
  }

  const template = `
import type { AppElement } from '@erudit-js/prose/app';

${Object.entries(apps)
  .map(
    ([importName, importPath]) =>
      `import ${importName} from '${importPath.replace(/\.(ts|js)$/, '')}';`,
  )
  .join('\n')}

export const appElementsArray: AppElement[] = [
    ${Object.keys(apps).join(',\n    ')}
].flatMap(element => (Array.isArray(element) ? element : [element]) as any);

export const appElements = Object.fromEntries(
    appElementsArray.map(element => [element.schema.name, element])
);
    `.trim();

  addTemplate({
    write: true,
    filename: '#erudit/prose/app.ts',
    getContents: () => template,
  });

  const alias = (nuxt.options.alias ||= {});
  alias['#erudit/prose/app'] = nuxt.options.buildDir + '/#erudit/prose/app.ts';
}
