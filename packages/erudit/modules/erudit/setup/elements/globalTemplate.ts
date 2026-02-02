import { existsSync } from 'node:fs';
import type { Nuxt } from 'nuxt/schema';
import { addTemplate } from 'nuxt/kit';

import type { ElementData } from './shared';

export function createGlobalTemplate(nuxt: Nuxt, elementsData: ElementData[]) {
  const defaultImportName = (type: 'core' | 'global', elementName: string) =>
    `${type}_${elementName}`;

  const cores: Record<string, string> = {};
  const globals: Record<string, string> = {};

  for (const elementData of elementsData) {
    cores[defaultImportName('core', elementData.name)] =
      elementData.absCorePath;

    if (existsSync(elementData.absDirectory + '/_global.ts')) {
      globals[defaultImportName('global', elementData.name)] =
        elementData.absDirectory + '/_global.ts';
    }
  }

  const template = `
import { PROSE_REGISTRY } from '@jsprose/core';
import { jsx, jsxs, Fragment } from '@jsprose/core/jsx-runtime';
import type { EruditProseCoreElement } from '@erudit-js/prose';
import { defineProblemScript } from '@erudit-js/prose/elements/problem/problemScript';

${Object.entries(cores)
  .map(
    ([importName, importPath]) =>
      `import ${importName} from '${importPath.replace(/\.(ts|js)$/, '')}';`,
  )
  .join('\n')}

${Object.entries(globals)
  .map(
    ([importName, importPath]) =>
      `import ${importName} from '${importPath.replace(/\.(ts|js)$/, '')}';`,
  )
  .join('\n')}

const coreElements: EruditProseCoreElement[] = [
    ${Object.keys(cores).join(',\n    ')}
].flatMap(element => (Array.isArray(element) ? element : [element]) as any);

const elementsGlobals = {
    ${Object.keys(globals)
      .map((key) => `...${key}`)
      .join(',\n    ')}
}

export function registerProseGlobals() {
    for (const element of coreElements) {
        PROSE_REGISTRY.addItem(element.registryItem);
        Object.assign(globalThis, element.registryItem.tags || {});
    }

    Object.assign(globalThis, {
        // Make jsx runtime globally available (for prose generation in isolated modules like problem scripts)
        jsx,
        jsxs,
        Fragment,
        // Problem globals
        defineProblemScript,
        // Elements globals
        ...elementsGlobals
    });
}
    `.trim();

  addTemplate({
    write: true,
    filename: '#erudit/prose/global.ts',
    getContents: () => template,
  });

  const alias = (nuxt.options.alias ||= {});
  alias['#erudit/prose/global'] =
    nuxt.options.buildDir + `/#erudit/prose/global.ts`;
}
