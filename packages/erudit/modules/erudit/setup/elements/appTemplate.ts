import type { Nuxt } from 'nuxt/schema';
import { addTemplate } from 'nuxt/kit';

import type { ElementData } from './shared';
import { toJsSlug } from '../toJsSlug';

export function createAppTemplate(nuxt: Nuxt, elementsData: ElementData[]) {
  const importName = (i: number, name: string) => `app_${i}_${toJsSlug(name)}`;

  const apps: Record<string, string> = {};

  for (let i = 0; i < elementsData.length; i++) {
    const elementData = elementsData[i]!;
    if (elementData.absAppPath) {
      apps[importName(i, elementData.name)] = elementData.absAppPath;
    }
  }

  const template = `
import type { ProseAppElements } from '@erudit-js/prose/app';

${Object.entries(apps)
  .map(
    ([importName, importPath]) =>
      `import ${importName} from '${importPath.replace(/\.(ts|js)$/, '')}';`,
  )
  .join('\n')}

export const appElements: ProseAppElements = Object.fromEntries([
  ${Object.keys(apps).join(',\n  ')}
  ]
  .flatMap((element: any) => (Array.isArray(element) ? element : [element]))
  .map((element: any) => [element.schema.name, element])
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
