import { exit } from 'node:process';
import { globSync } from 'glob';
import chokidar, { type FSWatcher } from 'chokidar';
import type { Nuxt } from 'nuxt/schema';

import { eruditPath, projectPath } from '@erudit/globalPath';
import { logger } from '@erudit/module/logger';
import { stress } from '@erudit/utils/stress';

const watchTargets: string[] = [
    // Erudit Nuxt config file
    eruditPath('nuxt.config.ts'),
    // Erudit Globals
    eruditPath('globals'),
    // Erudit Nuxt module non-runtime files
    ...globSync(eruditPath('module/**/*')),
    // Erudit config in project root
    ...globSync(projectPath('erudit.{js,ts}')),
    // Erudit Bitran config in project root
    ...globSync(projectPath('bitran.{js,ts}')),
];

const ignoreTargets: string[] = [
    // Erudit Nuxt module runtime files
    ...globSync(eruditPath('module/runtime/**/*')),
];

const restartDelay = 300;

//
//
//

let watcher: FSWatcher;
let restartTimeout: any;
let nuxt: Nuxt;

export function setupRestartWatcher(_nuxt: Nuxt) {
    nuxt = _nuxt;

    if (watcher) return;

    watcher = chokidar.watch(watchTargets, {
        ignored: ignoreTargets,
        ignoreInitial: true,
    });

    watcher.on('all', (event, path) => {
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(() => {
            console.log('\n');
            logger.info(
                `Restarting due to critical file change: ${stress(path)}\n\n`,
            );
            // Nuxt Restart Hook won't work when unhandled Node exception is thrown!
            // nuxt.callHook('restart', { hard: true, });
            // So we kill the process and restart it in Erudit CLI instead.
            exit(1337);
        }, restartDelay);
    });
}
