import type { Nuxt } from '@nuxt/schema';
import chokidar from 'chokidar';
import { debounce } from 'perfect-debounce';
import { globSync } from 'glob';
import chalk from 'chalk';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';
import { moduleLogger } from '../logger';

export async function setupEruditFullRestart(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    if (!nuxt.options.dev) {
        return;
    }

    const paths = runtimeConfig.paths;

    const watchTargets: string[] = [
        paths.module,
        paths.package + '/shared',
        paths.package + '/nuxt.config.ts',
        ...globSync(paths.project + '/erudit.config.{js,ts}'),
        ...globSync(paths.project + '/bitran.{app,server}.{js,ts}'),
    ];

    const watcher = chokidar.watch(watchTargets, {
        ignoreInitial: true,
    });

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

        await watcher.close();
        await nuxt.callHook('close', nuxt);
        process.exit(1337);
    }, 300);

    watcher.on('all', (event, filePath) => {
        if (filePath.trim()) {
            changedPaths.add(String(filePath));
            tryRestartNuxt();
        }
    });
}
