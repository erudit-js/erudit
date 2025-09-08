import type { Nuxt } from '@nuxt/schema';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';

export async function optimizeTranspileEruditDependencies(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    // const transpile = (nuxt.options.build.transpile ||= []);
    // const optimizeDeps = nuxt.options.vite.optimizeDeps || {};
    // const optimizeDepsInclude = (optimizeDeps.include ||= []);
    // const dependencies = runtimeConfig.project.dependencies;
    // for (const [dependencyName, options] of Object.entries(dependencies)) {
    //     if (options?.transpile) transpile.push(dependencyName);
    //     if (options?.optimize) optimizeDepsInclude.push(dependencyName);
    // }
}
