import chalk from 'chalk';
import chokidar, { FSWatcher } from 'chokidar';
import { debounce } from 'perfect-debounce';

// Builders
import { buildContributors } from './contributors/build';
import { buildSponsors } from './sponsors/build';

export async function buildServerErudit() {
    ERUDIT.buildPromise = (async () => {
        ERUDIT.log.start('Building...');
        await buildContributors();
        await buildSponsors();
        ERUDIT.log.success(chalk.green('Build Complete!'));
    })();
}

let pendingRebuild = false;
let watcher: FSWatcher;

export async function setupServerProjectWatcher() {
    const paths = ERUDIT.config.paths;

    const watchTargets: string[] = [
        paths.project + '/content',
        paths.project + '/cameos',
        paths.project + '/contributors',
        paths.project + '/sponsors',
    ];

    watcher ||= chokidar.watch(watchTargets, {
        ignoreInitial: true,
    });

    const changedPaths = new Set<string>();

    const tryRebuildErudit = debounce(async () => {
        pendingRebuild = true;
        await ERUDIT.buildPromise;
        const files = Array.from(changedPaths);
        changedPaths.clear();
        console.log();
        ERUDIT.log.warn(
            `${chalk.yellow('Rebuilding due to file change(s):')}\n\n` +
                files
                    .map((p, i) => chalk.gray(`${i + 1} -`) + ` "${p}"`)
                    .join('\n'),
        );
        console.log();
        await buildServerErudit();
        pendingRebuild = false;
    }, 300);

    watcher.on('all', (event, filePath) => {
        if (pendingRebuild) {
            return;
        }

        if (filePath.trim()) {
            changedPaths.add(String(filePath));
            tryRebuildErudit();
        }
    });

    ERUDIT.log.success('Project files watcher setup complete!');
}

export async function closeServerProjectWatcher() {
    if (watcher) {
        await watcher.close();
    }
}
