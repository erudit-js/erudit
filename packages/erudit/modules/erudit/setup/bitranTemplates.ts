import { globSync } from 'glob';
import type { Nuxt } from '@nuxt/schema';
import { addTemplate } from 'nuxt/kit';

import type { EruditRuntimeConfig } from '../../../shared/types/runtimeConfig';
import { moduleLogger } from '../logger';

export async function setupEruditBitranTemplates(
    nuxt: Nuxt,
    runtimeConfig: EruditRuntimeConfig,
) {
    const serverBitranPath = runtimeConfig.paths.project + '/bitran.server';
    const appBitranPath = runtimeConfig.paths.project + '/bitran.app';

    const hasServerBitran = globSync(serverBitranPath + '.*').length > 0;
    const hasAppBitran = globSync(appBitranPath + '.*').length > 0;
    const hasIncompleteBitranConfig = hasServerBitran !== hasAppBitran;

    if (hasIncompleteBitranConfig) {
        moduleLogger.warn(
            `Failed to load Bitran. Make sure you have "bitran.server" and "bitran.app" files in your project root!`,
        );
    }

    const serverBitranTemplateName = '#erudit/bitran/server.ts';
    const appBitranTemplateName = '#erudit/bitran/app.ts';

    addTemplate({
        write: true,
        filename: serverBitranTemplateName,
        getContents: () => `
            import type { ElementTranspilers } from '@bitran-js/transpiler';
            import { eruditTranspilers } from '@erudit-js/bitran-elements/defaultServer';
            ${hasServerBitran ? `import getProjectTranspilers from '${serverBitranPath}';` : ''}

            export default async function() {
                const projectTranspilers = ${hasServerBitran ? 'await getProjectTranspilers()' : '{}'};
                return {
                    ...eruditTranspilers,
                    ...projectTranspilers,
                } as ElementTranspilers;
            }
        `,
    });

    addTemplate({
        write: true,
        filename: appBitranTemplateName,
        getContents: () => `
            import type { EruditBitranElements } from '@erudit-js/cog/schema';
            import { eruditElements } from '@erudit-js/bitran-elements/defaultApp';
            ${hasAppBitran ? `import getProjectElements from '${appBitranPath}';` : ''}

            export default async function() {
                const projectElements = ${hasAppBitran ? 'await getProjectElements()' : '{}'};
                return {
                    ...eruditElements,
                    ...projectElements,
                } as EruditBitranElements;
            }
        `,
    });

    const alias = (nuxt.options.alias ||= {});
    alias['#erudit/bitran/server'] =
        runtimeConfig.paths.build + '/nuxt/.nuxt/' + serverBitranTemplateName;
    alias['#erudit/bitran/app'] =
        runtimeConfig.paths.build + '/nuxt/.nuxt/' + appBitranTemplateName;
}
