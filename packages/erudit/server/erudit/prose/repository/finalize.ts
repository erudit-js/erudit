import {
  fillProseStorage,
  isProseElement,
  isRawElement,
  type ProseElement,
  type ProseStorage,
  type ProseWithStorage,
  type RawElement,
} from 'tsprose';
import { imageSchema } from '@erudit-js/prose/elements/image/core';
import { videoSchema } from '@erudit-js/prose/elements/video/core';
import { calloutSchema } from '@erudit-js/prose/elements/callout/core';
import {
  referenceSchema,
  refSchema,
} from '@erudit-js/prose/elements/link/reference/core';
import {
  dependencySchema,
  depSchema,
} from '@erudit-js/prose/elements/link/dependency/core';
import { problemSchema } from '@erudit-js/prose/elements/problem/problem';
import { subProblemSchema } from '@erudit-js/prose/elements/problem/problems';
import { problemCheckSchema } from '@erudit-js/prose/elements/problem/problemCheck';

import { createImageStorage } from '../storage/image';
import { createVideoStorage } from '../storage/video';
import { createCalloutStorage } from '../storage/callout';
import { createLinkStorage } from '../storage/link';
import { createProblemScriptStorage } from '../storage/problemScript';

import { coreElements } from '#erudit/prose/global';

async function createStorageForRawElement(
  rawElement: RawElement,
  storageKey: string,
) {
  switch (true) {
    case isRawElement(rawElement, imageSchema):
      return await createImageStorage(rawElement as any);
    case isRawElement(rawElement, videoSchema):
      return createVideoStorage(rawElement as any);
    case isRawElement(rawElement, calloutSchema):
      return createCalloutStorage(rawElement as any);
    case isRawElement(rawElement, refSchema):
    case isRawElement(rawElement, referenceSchema):
    case isRawElement(rawElement, depSchema):
    case isRawElement(rawElement, dependencySchema):
      return await createLinkStorage(rawElement as any, storageKey);
    case isRawElement(rawElement, problemSchema):
    case isRawElement(rawElement, subProblemSchema):
      return createProblemScriptStorage(rawElement as any, storageKey);
  }
}

async function collectEnsureStorage(
  rawElements: RawElement[],
  storage: ProseStorage,
) {
  for (const rawElement of rawElements) {
    if (rawElement.storageKey && !(rawElement.storageKey in storage)) {
      const value = await createStorageForRawElement(
        rawElement,
        rawElement.storageKey,
      );
      if (value !== undefined) {
        storage[rawElement.storageKey] = value;
      }
    }
    if (rawElement.children) {
      await collectEnsureStorage(rawElement.children as RawElement[], storage);
    }
  }
}

async function processEnsureStorage(
  element: ProseElement,
  storage: ProseStorage,
) {
  if (
    (isProseElement(element, problemSchema) ||
      isProseElement(element, subProblemSchema) ||
      isProseElement(element, problemCheckSchema)) &&
    element.data.ensureStorage
  ) {
    await collectEnsureStorage(element.data.ensureStorage, storage);
    delete element.data.ensureStorage;
  }
  if (element.children) {
    for (const child of element.children as ProseElement[]) {
      await processEnsureStorage(child, storage);
    }
  }
}

export async function finalizeProse(
  prose: ProseElement,
): Promise<ProseWithStorage> {
  const storageCreators = Object.fromEntries(
    Object.entries(coreElements)
      .map(([key, coreElement]) => [key, coreElement.createStorage])
      .filter(([, createStorage]) => Boolean(createStorage)),
  );

  const storage = await fillProseStorage({
    prose,
    storageCreators,
    alterValue: async ({ element, storageKey }) => {
      switch (true) {
        case isProseElement(element, imageSchema):
          return await createImageStorage(element);
        case isProseElement(element, videoSchema):
          return createVideoStorage(element);
        case isProseElement(element, calloutSchema):
          return createCalloutStorage(element);
        case isProseElement(element, refSchema):
        case isProseElement(element, referenceSchema):
        case isProseElement(element, depSchema):
        case isProseElement(element, dependencySchema):
          return await createLinkStorage(element, storageKey);
        case isProseElement(element, problemSchema):
        case isProseElement(element, subProblemSchema):
          return createProblemScriptStorage(element, storageKey);
      }
    },
  });

  await processEnsureStorage(prose, storage);

  return {
    prose,
    storage,
  };
}
