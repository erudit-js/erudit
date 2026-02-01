import { type FSWatcher, watch } from 'chokidar';
import { type Nuxt } from 'nuxt/schema';
import { ERUDIT_PATH, PROJECT_PATH } from './env';

export let ERUDIT_PROJECT_WATCHER: FSWatcher | undefined;
export let ERUDIT_PACKAGE_WATCHER: FSWatcher | undefined;

export async function setupWatchers(nuxt: Nuxt) {
    if (nuxt.options.dev === false) {
        return;
    }

    ERUDIT_PROJECT_WATCHER = watch(PROJECT_PATH, {
        ignoreInitial: true,
    });

    ERUDIT_PACKAGE_WATCHER = watch(ERUDIT_PATH, {
        ignoreInitial: true,
    });
}
