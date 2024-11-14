import { addTemplate } from 'nuxt/kit';
import type { Nuxt } from 'nuxt/schema';

import { ERUDIT_DIR, eruditEndNuxtPath, PROJECT_DIR } from '@erudit/globalPath';

export function setupGlobalPaths(_nuxt: Nuxt) {
    const templateFilename = '#erudit/globalPaths.ts';

    addTemplate({
        filename: templateFilename,
        write: true,
        getContents: () => `
            export const ERUDIT_DIR = '${ERUDIT_DIR}';
            export const PROJECT_DIR = '${PROJECT_DIR}';
        `,
    });

    const alias = (_nuxt.options.alias ||= {});
    alias['#erudit/globalPaths'] = eruditEndNuxtPath(
        `.nuxt/${templateFilename}`,
    );
}
