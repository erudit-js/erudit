import type { AnySchema, ProseElement } from '@jsprose/core';

import type { EruditProseContext } from './context.js';
import type { EruditRawElement } from './rawElement.js';

export type ResolveStep<TReturn = undefined> = (args: {
  context: EruditProseContext;
  rawElement: EruditRawElement<AnySchema>;
  proseElement: ProseElement<AnySchema>;
}) => TReturn | Promise<TReturn>;

export function defineResolveStep<TReturn, TStep extends ResolveStep<TReturn>>(
  step: TStep,
) {
  return step;
}
