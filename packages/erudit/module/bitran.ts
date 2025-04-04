import { globSync } from 'glob';
import { addTemplate } from 'nuxt/kit';
import type { Nuxt } from 'nuxt/schema';

import { eruditEndNuxtPath, projectPath } from '@erudit/globalPath';
import { logger } from '@erudit/module/logger';

export async function setupBitranTemplates(_nuxt: Nuxt) {
    const serverConfigPath = projectPath('bitran.server');
    const appConfigPath = projectPath('bitran.app');

    const hasServerConfig = globSync(serverConfigPath + '.*').length > 0;
    const hasAppConfig = globSync(appConfigPath + '.*').length > 0;
    const hasIncompleteBitranConfig = hasServerConfig !== hasAppConfig;

    if (hasIncompleteBitranConfig) {
        logger.warn(
            `Failed to load Bitran. Make sure you have "bitran.server" and "bitran.app" files in your project root!`,
        );
    }

    const serverTemplateName = '#erudit/bitran/server.ts';
    const appTemplateName = '#erudit/bitran/app.ts';

    addTemplate({
        filename: serverTemplateName,
        write: true,
        getContents: () => `
            import type { ElementTranspilers } from '@bitran-js/transpiler';
            import { eruditTranspilers } from '@erudit-js/bitran-elements/defaultServer';
            ${hasServerConfig ? `import getProjectTranspilers from '${serverConfigPath}';` : ''}

            export default async function() {
                const projectTranspilers = ${hasServerConfig ? 'await getProjectTranspilers()' : '{}'};
                return {
                    ...eruditTranspilers,
                    ...projectTranspilers,
                } as ElementTranspilers;
            }
        `,
    });

    addTemplate({
        filename: appTemplateName,
        write: true,
        getContents: () => `
            import type { EruditBitranElements } from '@erudit-js/cog/schema';
            import { eruditElements } from '@erudit-js/bitran-elements/defaultApp';
            ${hasAppConfig ? `import getProjectElements from '${appConfigPath}';` : ''}

            export default async function() {
                const projectElements = ${hasAppConfig ? 'await getProjectElements()' : '{}'};
                return {
                    ...eruditElements,
                    ...projectElements,
                } as EruditBitranElements;
            }
        `,
    });

    const alias = (_nuxt.options.alias ||= {});
    alias['#erudit/bitran/server'] = eruditEndNuxtPath(
        `.nuxt/${serverTemplateName}`,
    );
    alias['#erudit/bitran/app'] = eruditEndNuxtPath(`.nuxt/${appTemplateName}`);
}
