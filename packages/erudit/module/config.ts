import { addTemplate } from 'nuxt/kit';
import type { Nuxt } from 'nuxt/schema';
import type { EruditConfig } from 'erudit-cog/schema';

import { eruditEndNuxtPath, projectPath } from '@erudit/globalPath';
import { logger } from '@erudit/module/logger';

export async function setupEruditConfig(_nuxt: Nuxt) {
    let config: Partial<EruditConfig> = {};

    try {
        const projectConfig = (await import(projectPath('erudit'))).default;
        if (!projectConfig) throw new Error('Falsy Erudit config!');
        config = projectConfig;
    } catch (error) {
        logger.warn(`Failed to load Erudit config!\n\n${error}`);
    }

    const templateFilename = '#erudit/config.ts';

    addTemplate({
        filename: templateFilename,
        write: true,
        getContents: () => `
            import type { EruditConfig } from 'erudit-cog/schema';
            export default ${JSON.stringify(config, null, '    ')} as Partial<EruditConfig>;
        `,
    });

    const alias = (_nuxt.options.alias ||= {});
    alias['#erudit/config'] = eruditEndNuxtPath(`.nuxt/${templateFilename}`);

    return config;
}
