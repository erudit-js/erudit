import { type FSWatcher, watch } from 'chokidar';
import { type Nuxt } from 'nuxt/schema';

import { type EruditRuntimeConfig } from '../../shared/types/runtimeConfig';

export let ERUDIT_PROJECT_WATCHER: FSWatcher | undefined;
export let ERUDIT_PACKAGE_WATCHER: FSWatcher | undefined;

export async function setupWatchers(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    if (nuxt.options.dev === false) {
        return;
    }

    const projectDir = runtimeConfig.paths.project;
    const packageDir = runtimeConfig.paths.package;

    ERUDIT_PROJECT_WATCHER = watch(projectDir, {
        ignoreInitial: true,
    });

    ERUDIT_PACKAGE_WATCHER = watch(packageDir, {
        ignoreInitial: true,
    });
}
