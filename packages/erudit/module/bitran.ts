import { addTemplate } from 'nuxt/kit';
import type { Nuxt } from 'nuxt/schema';

import { eruditEndNuxtPath, projectPath } from '@erudit/globalPath';
import type { EruditBitranConfig } from '@erudit/globals/bitran';
import { logger } from '@erudit/module/logger';

export async function setupBitranConfig(_nuxt: Nuxt) {
    let config: Partial<EruditBitranConfig>;

    try {
        const projectConfig = (await import(projectPath('bitran'))).default;
        if (!projectConfig) throw new Error('Falsy Bitran config!');
        config = projectConfig;
    } catch (error) {
        logger.warn(`Failed to load Bitran config!\n\n${error}`);
    }

    const templateFilename = '#erudit/client/bitran.ts';

    addTemplate({
        filename: templateFilename,
        write: true,
        getContents: () => `
            ${config ? `import bitranConfig from '${projectPath('bitran')}';` : ''}
            export default ${config ? 'bitranConfig' : 'undefined'};
        `,
    });

    const alias = (_nuxt.options.alias ||= {});
    alias['#erudit/client/bitran'] = eruditEndNuxtPath(
        `.nuxt/${templateFilename}`,
    );
}
