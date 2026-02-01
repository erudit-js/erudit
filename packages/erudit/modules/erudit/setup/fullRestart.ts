import type { Nuxt } from '@nuxt/schema';
import { debounce } from 'perfect-debounce';
import chalk from 'chalk';
import { sn } from 'unslash';

import { ERUDIT_PACKAGE_WATCHER, ERUDIT_PROJECT_WATCHER } from '../watcher';
import { moduleLogger } from '../logger';
import { ERUDIT_PATH, PROJECT_PATH } from '../env';

export async function setupEruditFullRestart(nuxt: Nuxt) {
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
        // Check if it is in Erudit Nuxt Layer "modules" directory
        if (path.startsWith(sn(ERUDIT_PATH, 'modules'))) {
            return true;
        }

        // Check if it is in Erudit Nuxt Layer "shared" directory
        if (path.startsWith(sn(ERUDIT_PATH, 'shared'))) {
            return true;
        }

        // Check if it is Erudit Nuxt Layer "nuxt.config.ts" file
        if (path === sn(ERUDIT_PATH, 'nuxt.config.ts')) {
            return true;
        }

        // Check if it is project "erudit.config.ts" file
        if (path === sn(PROJECT_PATH, 'erudit.config.ts')) {
            return true;
        }

        return false;
    };

    const handleFileChange = (_event: string, path: string) => {
        path = sn(path);

        if (path.trim() && isTargetFile(path)) {
            changedPaths.add(String(path));
            tryRestartNuxt();
        }
    };

    ERUDIT_PACKAGE_WATCHER?.on('all', handleFileChange);
    ERUDIT_PROJECT_WATCHER?.on('all', handleFileChange);
}
