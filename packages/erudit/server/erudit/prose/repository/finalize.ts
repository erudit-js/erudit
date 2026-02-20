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
    alterValue: async (element) => {
      switch (true) {
        case isProseElement(element, imageSchema):
          await createImageStorage(element, storage);
          break;
        case isProseElement(element, videoSchema):
          await createVideoStorage(element, storage);
          break;
        case isProseElement(element, calloutSchema):
          await createCalloutStorage(element, storage);
          break;
        case isProseElement(element, refSchema):
        case isProseElement(element, referenceSchema):
        case isProseElement(element, depSchema):
        case isProseElement(element, dependencySchema):
          await createLinkStorage(element, storage);
          break;
        case isProseElement(element, problemSchema):
        case isProseElement(element, subProblemSchema):
          await createProblemScriptStorage(element, storage);
          break;
      }
    },
  });

  return {
    prose,
    storage,
  };
}
