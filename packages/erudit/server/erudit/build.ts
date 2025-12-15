import chalk from 'chalk';
import chokidar from 'chokidar';
import { debounce } from 'perfect-debounce';

// Builders
import { buildContributors } from './contributors/build';
import { buildSponsors } from './sponsors/build';
import { buildContentNav } from './content/nav/build';
import slash from 'slash';
import { resolveContent } from './content/resolve';

export type EruditServerChangedFiles = Set<string>;
export type EruditServerBuildError = Error | undefined;

export async function buildServerErudit() {
    ERUDIT.buildPromise = (async () => {
        ERUDIT.buildError = undefined;

        try {
            ERUDIT.log.start('Building...');
            await buildContributors();
            await buildSponsors();
            await buildContentNav();
            await resolveContent();
            ERUDIT.log.success(chalk.green('Build Complete!'));
        } catch (buildError) {
            if (buildError instanceof Error) {
                ERUDIT.buildError = buildError;
                if (buildError.stack) {
                    ERUDIT.log.error(buildError.stack);
                }
            } else {
                ERUDIT.buildError = createError({
                    statusCode: 500,
                    statusMessage: 'Unknown Erudit Build Error!',
                    message:
                        typeof buildError === 'string'
                            ? buildError
                            : 'An unknown error occurred!',
                });
                ERUDIT.log.error(ERUDIT.buildError.message);
            }
        }
    })();

    await ERUDIT.buildPromise;
}

//
// Watcher
//

export async function tryServerWatchProject() {
    if (ERUDIT.config.public.mode === 'generate') {
        // Generate is single pass so no watching
        return;
    }

    let pendingRebuild = false;
    ERUDIT.changedFiles = new Set<string>();

    const tryRebuildErudit = debounce(async () => {
        pendingRebuild = true;
        try {
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
        } finally {
            ERUDIT.changedFiles.clear();
            pendingRebuild = false;
        }
    }, 300);

    function isWatched(path: string) {
        if (path.startsWith(ERUDIT.config.paths.project + '/content/')) {
            return true;
        }

        if (path.startsWith(ERUDIT.config.paths.project + '/contributors/')) {
            // Only watch files inside contributor folders, not the contributors directory itself
            const relativePath = path.substring(
                (ERUDIT.config.paths.project + '/contributors/').length,
            );
            const pathParts = relativePath.split('/');
            // Must have at least 2 parts: contributorId/filename
            return pathParts.length >= 2;
        }

        if (path.startsWith(ERUDIT.config.paths.project + '/cameos/')) {
            return true;
        }

        if (path.startsWith(ERUDIT.config.paths.project + '/sponsors/')) {
            return true;
        }
    }

    const watcher = chokidar.watch(ERUDIT.config.paths.project, {
        ignoreInitial: true,
    });

    watcher.on('all', (_, path) => {
        path = slash(path);

        if (!isWatched(path)) {
            return;
        }

        if (pendingRebuild) {
            return;
        }

        if (path.trim()) {
            ERUDIT.changedFiles.add(String(path));
            tryRebuildErudit();
        }
    });

    ERUDIT.log.success('Server project watcher is active 👀');
}
