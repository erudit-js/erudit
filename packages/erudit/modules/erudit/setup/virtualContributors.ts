import type { Nuxt } from 'nuxt/schema';
import { addTemplate, updateTemplates } from 'nuxt/kit';
import { globSync } from 'glob';
import { debounce } from 'perfect-debounce';
import slash from 'slash';
import chalk from 'chalk';

import { virtualContributorsModule } from '@erudit-js/core/contributor';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';
import { ERUDIT_PROJECT_WATCHER } from '../watcher';
import { moduleLogger } from '../logger';

export async function setupVirtualContributors(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    function collectContributorIds() {
        return globSync(runtimeConfig.paths.project + '/contributors/*/').map(
            (path) => slash(path).split('/').pop()!,
        );
    }

    addTemplate({
        write: true,
        filename: '#erudit/contributors.ts',
        getContents() {
            const contributorIds = collectContributorIds();
            return virtualContributorsModule(contributorIds);
        },
    });

    const alias = (nuxt.options.alias ||= {});
    alias['#erudit/contributors'] =
        nuxt.options.buildDir + `/#erudit/contributors.ts`;

    logContributorIds(true, collectContributorIds());

    //
    // Rebuild
    //

    const tryRebuildContributors = debounce(() => {
        updateTemplates({
            filter(template) {
                return template.filename === '#erudit/contributors.ts';
            },
        });
        logContributorIds(false, collectContributorIds());
    }, 300);

    ERUDIT_PROJECT_WATCHER?.on('all', (_event, path) => {
        if (
            slash(path).startsWith(
                runtimeConfig.paths.project + '/contributors/',
            )
        ) {
            tryRebuildContributors();
        }
    });
}

function logContributorIds(initial: boolean, contributorIds: string[]) {
    if (contributorIds.length === 0) {
        return;
    }

    moduleLogger.success(
        `${initial ? 'Loaded' : 'Updated'} ${contributorIds.length} contributor(s):\n` +
            chalk.gray(contributorIds.map((id) => `${id}`).join(', ')),
    );
}
