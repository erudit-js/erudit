import { styleText } from 'node:util';
import chokidar from 'chokidar';
import { debounce } from 'perfect-debounce';
import { sn } from 'unslash';

// Builders
import { buildContributors } from './contributors/build';
import { buildSponsors } from './sponsors/build';
import { buildCameos } from './cameos/build';
import { buildContentNav } from './content/nav/build';
import { requestFullContentResolve, resolveContent } from './content/resolve';
import { buildGlobalContent } from './content/global/build';
import { buildNews } from './news/build';
import { triggerReload } from './reloadSignal';

export type EruditServerChangedFiles = Set<string>;
export type EruditServerBuildError = Error | undefined;

export async function buildServerErudit() {
  ERUDIT.buildPromise = (async () => {
    ERUDIT.buildError = undefined;

    try {
      ERUDIT.log.start('Building...');
      await buildContributors();
      await buildSponsors();
      await buildCameos();
      await buildNews();
      await buildContentNav();
      await buildGlobalContent();
      await resolveContent();
      ERUDIT.log.success(styleText('green', 'Build Complete!'));
    } catch (buildError) {
      requestFullContentResolve();

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
  if (ERUDIT.mode === 'static') {
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
        `${styleText('yellow', 'Rebuilding due to file change(s):')}\n\n` +
          files
            .map((p, i) => styleText('gray', `${i + 1} -`) + ` "${p}"`)
            .join('\n'),
      );
      console.log();
      await buildServerErudit();
      if (!ERUDIT.buildError) {
        triggerReload();
      }
      ERUDIT.changedFiles.clear();
    } finally {
      ERUDIT.changedFiles.clear();
      pendingRebuild = false;
    }
  }, 300);

  function isWatched(path: string) {
    if (path.startsWith(ERUDIT.paths.project('content') + '/')) {
      return true;
    }

    if (path.startsWith(ERUDIT.paths.project('contributors') + '/')) {
      return true;
    }

    if (path.startsWith(ERUDIT.paths.project('cameos') + '/')) {
      return true;
    }

    if (path.startsWith(ERUDIT.paths.project('sponsors') + '/')) {
      return true;
    }

    if (path.startsWith(ERUDIT.paths.project('news') + '/')) {
      return true;
    }
  }

  const watcher = chokidar.watch(ERUDIT.paths.project(), {
    ignoreInitial: true,
  });

  watcher.on('all', (_, path) => {
    path = sn(path);

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
