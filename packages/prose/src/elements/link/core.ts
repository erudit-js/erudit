import {
  ensureTagChildren,
  textSchema,
  type NormalizedChildren,
  type Unique,
} from 'tsprose';

import type { GlobalContentTypeguard } from '@erudit-js/core/content/global';

import type { ToEruditRawElement } from '../../rawElement.js';
import type { DepSchema, DependencySchema } from './dependency/core.js';
import { createLinkStorageKey } from './storage.js';
import type { ReferenceSchema, RefSchema } from './reference/core.js';
import { EruditProseError } from '../../error.js';

export interface LinkData {
  label: string;
  storageKey?: string;
}

export type LinkToProp = string | GlobalContentTypeguard | Unique;

export function handleLinkTag(
  element: ToEruditRawElement<
    DepSchema | DependencySchema | RefSchema | ReferenceSchema
  >,
  tagName: string,
  props: { to?: LinkToProp; on?: LinkToProp },
  children: NormalizedChildren,
) {
  ensureTagChildren(tagName, children, textSchema);
  const child = children[0];
  const label = child.data.trim();

  if (!label) {
    throw new EruditProseError(`<${tagName}> label cannot be empty!`);
  }

  element.data = { label };
  element.storageKey = createLinkStorageKey(props.to ?? props.on!);
}
