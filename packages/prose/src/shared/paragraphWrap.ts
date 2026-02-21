import type { NormalizedChildren, ToRawElement } from 'tsprose';

import { P, type ParagraphSchema } from '../elements/paragraph/core.js';

export function paragraphWrap(
  children: NormalizedChildren,
): undefined | [ToRawElement<ParagraphSchema>] {
  if (!children) {
    return undefined;
  }

  try {
    return [P({ children })];
  } catch {}

  return undefined;
}
