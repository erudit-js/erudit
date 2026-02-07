import { isRawElement } from '@jsprose/core';

import { defineResolveStep } from '../../resolveStep.js';
import { dependencySchema, depSchema } from './dependency/core.js';
import { referenceSchema, refSchema } from './reference/core.js';

export type ContentLinkTag = 'Dep' | 'Dependency' | 'Ref' | 'Reference';

export interface ContentLinkUsage {
  type: ContentLinkTag;
  label: string;
}

export type ContentLinks = Map<string, ContentLinkUsage[]>;

export interface ContentLinkStepReturn {
  storageKey: string;
  label: string;
  type: ContentLinkTag;
}

export const contentLinkStep = defineResolveStep(
  ({ rawElement, proseElement }): ContentLinkStepReturn | undefined => {
    if (!proseElement.id || !rawElement.storageKey) {
      return;
    }

    const checks = [
      { schema: depSchema, key: 'Dep' },
      { schema: dependencySchema, key: 'Dependency' },
      { schema: refSchema, key: 'Ref' },
      { schema: referenceSchema, key: 'Reference' },
    ] as const;

    for (const { schema, key } of checks) {
      if (isRawElement(rawElement, schema)) {
        return {
          storageKey: rawElement.storageKey,
          label: rawElement.data.label.trim(),
          type: key,
        };
      }
    }
  },
);
