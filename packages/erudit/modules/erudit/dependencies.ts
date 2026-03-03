import type { Nuxt } from 'nuxt/schema';
import type { EruditDependencies } from '@erudit-js/core/dependencies';

export function addDependencies(
  nuxt: Nuxt,
  dependencies: EruditDependencies | undefined,
) {
  const transpile = (nuxt.options.build.transpile ||= []);
  const optimizeDeps = nuxt.options.vite.optimizeDeps || {};
  const optimizeDepsInclude = (optimizeDeps.include ||= []);

  for (const [name, options] of Object.entries(dependencies ?? {})) {
    if (options?.transpile) transpile.push(name);
    if (options?.optimize) optimizeDepsInclude.push(name);
  }
}
