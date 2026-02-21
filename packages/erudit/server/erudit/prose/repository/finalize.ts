import {
  fillProseStorage,
  isProseElement,
  type ProseElement,
  type ProseWithStorage,
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

import { createImageStorage } from '../storage/image';
import { createVideoStorage } from '../storage/video';
import { createCalloutStorage } from '../storage/callout';
import { createLinkStorage } from '../storage/link';
import { createProblemScriptStorage } from '../storage/problemScript';

import { coreElements } from '#erudit/prose/global';

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

  return {
    prose,
    storage,
  };
}
