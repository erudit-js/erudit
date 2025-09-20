import chalk from 'chalk';
import chokidar, { FSWatcher } from 'chokidar';
import { debounce } from 'perfect-debounce';

// Builders
import { buildContributors } from './contributors/build';
import { buildSponsors } from './sponsors/build';
import { buildContentNav } from './content/nav/build';
import { parseContent } from './content/parse';

export type EruditServerChangedFiles = Set<string>;

export async function buildServerErudit() {
    ERUDIT.buildPromise = (async () => {
        ERUDIT.log.start('Building...');
        await buildContributors();
        await buildSponsors();
        await buildContentNav();
        await parseContent();
        ERUDIT.log.success(chalk.green('Build Complete!'));
    })();

    await ERUDIT.buildPromise;
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

    await watcher?.close();

    watcher ||= chokidar.watch(watchTargets, {
        ignoreInitial: true,
        usePolling: true,
        interval: 300,
        depth: 99,
        awaitWriteFinish: {
            stabilityThreshold: 200,
            pollInterval: 50,
        },
    });

    ERUDIT.changedFiles = new Set<string>();

    const tryRebuildErudit = debounce(async () => {
        pendingRebuild = true;
        await ERUDIT.buildPromise;
        const files = Array.from(ERUDIT.changedFiles);
        console.log();
        ERUDIT.log.warn(
            `${chalk.yellow('Rebuilding due to file change(s):')}\n\n` +
                files
                    .map((p, i) => chalk.gray(`${i + 1} -`) + ` "${p}"`)
                    .join('\n'),
        );
        console.log();
        await buildServerErudit();
        ERUDIT.changedFiles.clear();
        pendingRebuild = false;
    }, 300);

    watcher.on('all', (event, filePath) => {
        filePath = filePath.replaceAll('\\', '/');

        if (pendingRebuild) {
            return;
        }

        if (filePath.trim()) {
            ERUDIT.changedFiles.add(String(filePath));
            tryRebuildErudit();
        }
    });

    ERUDIT.log.success('Project files watcher setup complete!');
}

export async function closeServerProjectWatcher() {
    await watcher?.close();
}
