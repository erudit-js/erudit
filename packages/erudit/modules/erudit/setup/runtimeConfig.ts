import { resolveAlias } from '@nuxt/kit';
import type { Nuxt } from '@nuxt/schema';

import type {
    EruditPublicRuntimeConfig,
    EruditRuntimeConfig,
    EruditRuntimeConfigPaths,
} from '../../../shared/types/runtimeConfig';
import { version } from '../../../package.json';
import { slasher } from '../../../shared/utils/slasher';

export async function setupEruditRuntimeConfig(nuxt: Nuxt) {
    const eruditRuntimeConfig: EruditRuntimeConfig = {
        paths: resolvePaths(),
        project: {},
    } as any;

    const eruditPublicRuntimeConfig: EruditPublicRuntimeConfig = {
        version,
        project: {},
    } as any;

    nuxt.options.runtimeConfig.erudit = eruditRuntimeConfig as any;
    nuxt.options.runtimeConfig.public.erudit = eruditPublicRuntimeConfig as any;

    nuxt.options.runtimeConfig.public['buildTimestamp'] = Date.now();

    return {
        eruditRuntimeConfig,
        eruditPublicRuntimeConfig,
    };
}

function resolvePaths(): EruditRuntimeConfigPaths {
    const projectPath = process.env.ERUDIT_PROJECT_DIR;

    if (!projectPath) {
        throw new Error(
            `"ERUDIT_PROJECT_DIR" environment variable is not set! Erudit needs to know where projects files are located!`,
        );
    }

    const layerPrefix = '#layers/erudit';

    const _normalize = (path: string) => {
        return slasher(path, { trailing: false });
    };

    return {
        package: _normalize(resolveAlias(`${layerPrefix}`)),
        module: _normalize(resolveAlias(`${layerPrefix}/modules/erudit`)),
        app: _normalize(resolveAlias(`${layerPrefix}/app`)),
        server: _normalize(resolveAlias(`${layerPrefix}/server/erudit`)),
        project: _normalize(projectPath),
        build: _normalize(projectPath + '/.erudit'),
    };
}
