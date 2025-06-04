import chokidar, { type FSWatcher } from 'chokidar';

import { ERUDIT_DIR, PROJECT_DIR } from '#erudit/globalPaths';
import { ERUDIT_SERVER } from '@server/global';
import { logger } from '@server/logger';
import { build } from '@server/build/process';
import { stress } from '@erudit/utils/stress';

const watchTargets: string[] = [
    // Languages
    ERUDIT_DIR + '/languages',
    // Content directory
    PROJECT_DIR + '/content',
    // Contributors directory
    PROJECT_DIR + '/contributors',
    // Sponsors directory
    PROJECT_DIR + '/sponsors',
];

const ignoreTargets: string[] = [];

const rebuildDelay = 300;

//
//
//

let watcher: FSWatcher;
let rebuildTimeout: any;
let rebuildRequested = false;
let pendingRebuild = false;

export async function setupRebuildWatcher() {
    if (watcher) return;

    watcher = chokidar.watch(watchTargets, {
        ignored: ignoreTargets,
        ignoreInitial: true,
    });

    watcher.on('all', (event, path) =>
        requestServerRebuild(`File change: ${stress(path)}`),
    );
}

export async function requestServerRebuild(reason?: string) {
    // If rebuild is in progress, set flag for another rebuild after completion
    if (rebuildRequested) {
        pendingRebuild = true;
        return;
    }

    clearTimeout(rebuildTimeout);
    rebuildTimeout = setTimeout(async () => {
        rebuildRequested = true;
        await ERUDIT_SERVER.BUILD_PROMISE;
        console.log('\n');
        logger.info(`Rebuilding server data!${reason ? ` ${reason}` : ''}\n\n`);
        await build();
        rebuildRequested = false;

        // If changes were detected during rebuild, start another rebuild
        if (pendingRebuild) {
            pendingRebuild = false;
            requestServerRebuild('Changes detected during previous rebuild');
        }
    }, rebuildDelay);
}
