import { styleText } from 'node:util';
import type { Nuxt } from 'nuxt/schema';
import { findPath } from 'nuxt/kit';

import type { ProseCoreElement } from '@erudit-js/prose';

import type { EruditRuntimeConfig } from '../../../../shared/types/runtimeConfig';
import { moduleLogger } from '../../logger';
import type { ElementData } from './shared';
import { createTagsTable } from './tagsTable';
import { createElementGlobalTypes } from './elementGlobalTypes';
import { createGlobalTemplate } from './globalTemplate';
import { createAppTemplate } from './appTemplate';
import { PROJECT_PATH } from '../../env';

const BUILTIN_ELEMENT_PATHS = [
  '@erudit-js/prose/elements/callout',
  '@erudit-js/prose/elements/caption',
  '@erudit-js/prose/elements/details',
  '@erudit-js/prose/elements/emphasis',
  '@erudit-js/prose/elements/flex',
  '@erudit-js/prose/elements/gallery',
  '@erudit-js/prose/elements/heading',
  '@erudit-js/prose/elements/horizontalLine',
  '@erudit-js/prose/elements/image',
  '@erudit-js/prose/elements/lineBreak',
  '@erudit-js/prose/elements/link/dependency',
  '@erudit-js/prose/elements/link/reference',
  '@erudit-js/prose/elements/list',
  '@erudit-js/prose/elements/paragraph',
  '@erudit-js/prose/elements/problem',
  '@erudit-js/prose/elements/table',
  '@erudit-js/prose/elements/video',
];

export async function setupProseElements(
  nuxt: Nuxt,
  runtimeConfig: EruditRuntimeConfig,
) {
  const elementsData: ElementData[] = [];

  const seenElements = new Set<string>();
  const seenSchemas = new Set<string>();
  const seenTags = new Set<string>();

  const elementPaths: string[] = [
    ...BUILTIN_ELEMENT_PATHS,
    ...runtimeConfig.elements,
  ];

  for (const elementPath of elementPaths) {
    const pathParts = elementPath.split('/');
    let elementName = pathParts[pathParts.length - 1]!;
    let uniqueElementName = elementName;
    let counter = 1;
    while (seenElements.has(uniqueElementName)) {
      uniqueElementName = `${elementName}_${counter}`;
      counter++;
    }
    seenElements.add(uniqueElementName);

    const elementData: ElementData = {
      name: uniqueElementName,
      coreElements: [],
      absDirectory: '',
      absCorePath: '',
      absAppPath: undefined,
    };

    const corePath = elementPath + '/core';
    const coreAbsPath = await findPath(corePath, {
      cwd: PROJECT_PATH,
      extensions: ['.ts', '.js'],
    });

    if (!coreAbsPath) {
      throw new Error(
        `Failed to detect "core" part of prose element "${elementPath}"!`,
      );
    }

    elementData.absCorePath = coreAbsPath;
    elementData.absDirectory = coreAbsPath.replace(/\/core\.(?:ts|js)$/, '');

    const appPath = elementPath + '/app';
    const appAbsPath = await findPath(appPath, {
      cwd: PROJECT_PATH,
      extensions: ['.ts', '.js'],
    });

    if (appAbsPath) {
      elementData.absAppPath = appAbsPath;
    }

    const coreDefault: ProseCoreElement | ProseCoreElement[] = (
      await import(coreAbsPath)
    ).default;

    const coreElements = Array.isArray(coreDefault)
      ? coreDefault
      : [coreDefault];

    for (const coreElement of coreElements) {
      const schemaName = coreElement.schema.name;

      if (seenSchemas.has(schemaName)) {
        throw new Error(
          `Prose element schema name "${schemaName}" is already registered by another element!`,
        );
      }

      seenSchemas.add(schemaName);
      elementData.coreElements.push({
        schemaName,
        tags: {},
      });

      if (coreElement.tags) {
        for (let i = 0; i < coreElement.tags.length; i++) {
          const tag = coreElement.tags[i]!;
          if (seenTags.has(tag.tagName)) {
            throw new Error(
              `Prose element tag name "<${tag.tagName}>" is already registered by another element!`,
            );
          }

          seenTags.add(tag.tagName);
          elementData.coreElements[elementData.coreElements.length - 1]!.tags[
            tag.tagName
          ] = i;
        }
      }

      const transpile = (nuxt.options.build.transpile ||= []);
      const optimizeDeps = nuxt.options.vite.optimizeDeps || {};
      const optimizeDepsInclude = (optimizeDeps.include ||= []);

      for (const [name, options] of Object.entries(
        coreElement.dependencies ?? {},
      )) {
        if (options?.transpile) transpile.push(name);
        if (options?.optimize) optimizeDepsInclude.push(name);
      }
    }

    elementsData.push(elementData);
  }

  createElementGlobalTypes(elementsData);
  createGlobalTemplate(nuxt, elementsData);
  createAppTemplate(nuxt, elementsData);

  const elementsNumber = elementsData.length;
  const schemasNumber = seenSchemas.size;
  const tagsNumber = seenTags.size;

  moduleLogger.success(
    `
Registered ${elementsNumber} prose elements: ${schemasNumber} schema(s) and ${tagsNumber} tag(s)!
        `.trim(),
  );

  const tagsTable = createTagsTable(elementsData);
  console.log(
    tagsTable
      .split('\n')
      .map((line) => styleText('gray', line))
      .join('\n'),
  );
}
