import { globSync } from 'glob';
import { addTemplate } from 'nuxt/kit';
import type { Nuxt } from 'nuxt/schema';

import { eruditEndNuxtPath, projectPath } from '@erudit/globalPath';
import { logger } from '@erudit/module/logger';

export async function setupBitranTemplates(_nuxt: Nuxt) {
    const transpilersPath = projectPath('bitran.transpiler');
    const renderersPath = projectPath('bitran.renderer');

    const hasTranspilers = globSync(transpilersPath + '.*').length > 0;
    const hasRenderers = globSync(renderersPath + '.*').length > 0;
    const hasBitran = hasTranspilers && hasRenderers;

    if (!hasBitran) {
        logger.warn(
            `Failed to load Bitran. Make sure you have "bitran.transpilers" and "bitran.renderers" files in your project root!`,
        );
    }

    const transpilersTemplate = '#erudit/bitran/transpilers.ts';
    const renderersTemplate = '#erudit/bitran/renderers.ts';

    addTemplate({
        filename: transpilersTemplate,
        write: true,
        getContents: () => `
            import type { ElementTranspilers } from '@bitran-js/transpiler';
            ${hasTranspilers ? `import transpilers from '${transpilersPath}';` : ''}
            export default ${hasTranspilers ? 'transpilers' : '{}'} as ElementTranspilers;
        `,
    });

    addTemplate({
        filename: renderersTemplate,
        write: true,
        getContents: () => `
            import type { ElementVueRenderers } from '@bitran-js/renderer-vue';
            ${hasRenderers ? `import renderers from '${renderersPath}';` : ''}
            export default ${hasRenderers ? 'renderers' : '{}'} as ElementVueRenderers;
        `,
    });

    const alias = (_nuxt.options.alias ||= {});
    alias['#erudit/bitran/transpilers'] = eruditEndNuxtPath(
        `.nuxt/${transpilersTemplate}`,
    );
    alias['#erudit/bitran/renderers'] = eruditEndNuxtPath(
        `.nuxt/${renderersTemplate}`,
    );
}
