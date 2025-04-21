import { addTemplate } from 'nuxt/kit';
import type { Nuxt } from 'nuxt/schema';
import { globSync } from 'glob';

import { eruditEndNuxtPath, projectPath } from '@erudit/globalPath';
import { getContentPath } from '@erudit/utils/contentPath';

export async function setupProblemGenerators(_nuxt: Nuxt) {
    const templateName = '#erudit/problemGenerators.ts';

    addTemplate({
        filename: templateName,
        write: true,
        async getContents() {
            const generatorFiles = findGenerators();

            return `
export const loaders = {
${generatorFiles
    .map((file) => {
        const filePath = projectPath('content/' + file);
        const contentPath = getContentPath(
            file,
            projectPath('content'),
        ).replace(/\.gen\.(js|ts)$/, '');
        return `    '${contentPath}': async () => (await import('${filePath}')).default,`;
    })
    .join('\n')}
}
            `.trim();
        },
    });

    const alias = (_nuxt.options.alias ||= {});
    alias['#erudit/problemGenerators'] = eruditEndNuxtPath(
        `.nuxt/${templateName}`,
    );
}

function findGenerators() {
    const generatorFiles = globSync('**/*.gen.{js,ts}', {
        cwd: projectPath('content'),
        posix: true,
    });
    return generatorFiles;
}
