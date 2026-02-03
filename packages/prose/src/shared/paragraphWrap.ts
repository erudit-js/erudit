import {
  PROSE_REGISTRY,
  type NormalizedChildren,
  type RawElement,
} from '@jsprose/core';
import type { paragraphSchema } from '../elements/paragraph/core.js';

export function tryParagraphWrap(
  children: NormalizedChildren,
): undefined | [RawElement<typeof paragraphSchema>] {
  const P = PROSE_REGISTRY.getTag('P');

  let hasInliners = children?.some((child) => {
    const schema = PROSE_REGISTRY.getSchema(child.schemaName);
    return schema.type === 'inliner';
  });

  if (hasInliners) {
    return [
      P({
        children,
        __JSPROSE_registryProp: PROSE_REGISTRY,
      }) as any,
    ];
  }

  return undefined;
}
