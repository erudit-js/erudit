import {
  isRawElement,
  type RawElement,
  type Schema,
  type ToRawElement,
} from 'tsprose';

import type { TocRawElementProp } from './toc.js';
import type { SnippetRawElementProp } from './snippet.js';

export type ToEruditRawElement<
  TSchema extends Schema,
  TagName extends string = string,
> = ToRawElement<TSchema, TagName> &
  SnippetRawElementProp &
  TocRawElementProp & { title?: string };

export type EruditRawElement = ToEruditRawElement<Schema>;

export function asEruditRaw<TSchema extends Schema>(
  rawElement: RawElement,
): ToEruditRawElement<TSchema> {
  return rawElement as any;
}

export function isEruditRawElement<TSchema extends Schema>(
  element: any,
  schema?: TSchema,
): element is ToEruditRawElement<TSchema> {
  return isRawElement(element, schema);
}
