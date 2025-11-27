import type { Nuxt } from '@nuxt/schema';
import { debounce } from 'perfect-debounce';
import { globSync } from 'glob';
import chalk from 'chalk';
import slash from 'slash';

import { ERUDIT_PACKAGE_WATCHER, ERUDIT_PROJECT_WATCHER } from '../watcher';
import { moduleLogger } from '../logger';
import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';

export async function setupEruditFullRestart(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    const paths = runtimeConfig.paths;
    const changedPaths = new Set<string>();

    const tryRestartNuxt = debounce(async () => {
        const files = Array.from(changedPaths);
        changedPaths.clear();

        moduleLogger.warn(
            `${chalk.yellow('Full restart due to critical file change(s):')}\n\n` +
                files
                    .map((p, i) => chalk.gray(`${i + 1} -`) + ` "${p}"`)
                    .join('\n'),
        );

        await nuxt.callHook('close', nuxt);
        process.exit(1337);
    }, 300);

    const isTargetFile = (path: string): boolean => {
        // Check if it's in the module directory
        if (path.startsWith(paths.module)) {
            return true;
        }

        // Check if it's in package/shared
        if (path.startsWith(paths.package + '/shared')) {
            return true;
        }

        // Check if it's nuxt.config.ts in package
        if (path === paths.package + '/nuxt.config.ts') {
            return true;
        }

        // Check if it's erudit.config.{js,ts} in project
        const configFiles = globSync(
            paths.project + '/erudit.config.{js,ts}',
        ).map((p) => slash(p));
        if (configFiles.includes(path)) {
            return true;
        }

        return false;
    };

    const handleFileChange = (_event: string, path: string) => {
        path = slash(path);

        if (path.trim() && isTargetFile(path)) {
            changedPaths.add(String(path));
            tryRestartNuxt();
        }
    };

    ERUDIT_PACKAGE_WATCHER?.on('all', handleFileChange);
    ERUDIT_PROJECT_WATCHER?.on('all', handleFileChange);
}
