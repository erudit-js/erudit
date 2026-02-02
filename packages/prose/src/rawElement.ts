import type { AnySchema, RawElement, schemaKind } from '@jsprose/core';

import type { ObjRawElementSnippet } from './snippet.js';
import type { ObjRawElementToc } from './toc.js';
import type { ObjRawElementTitle } from './title.js';

export type EruditRawElement<
  TSchema extends AnySchema,
  TTagName extends string = string,
> = RawElement<TSchema, TTagName> &
  ObjRawElementSnippet &
  ObjRawElementToc &
  ObjRawElementTitle;

export function asEruditRaw<
  TSchema extends AnySchema,
  TRawElement extends RawElement<TSchema>,
>(
  rawElement: TRawElement,
): EruditRawElement<TRawElement[typeof schemaKind], TRawElement['tagName']> {
  return rawElement as any;
}
