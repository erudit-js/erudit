import { existsSync, mkdirSync, rmSync, writeFileSync } from 'node:fs';
import { consola } from 'consola';

import { alias2Relative } from './alias2Relative';

export async function prepare(projectPath: string, eruditPath: string) {
    const eruditBuildDir = `${projectPath}/.erudit`;
    const distDir = `${projectPath}/dist`;

    const nodeModules = `${projectPath}/node_modules`;
    const nodeModulesErudit = `${nodeModules}/erudit`;

    if (existsSync(nodeModulesErudit)) {
        consola.start('Resolving aliases in dependencies...');
        await alias2Relative(nodeModulesErudit, nodeModulesErudit);
        await alias2Relative(
            nodeModulesErudit,
            nodeModules + '/@erudit-js/bitran-elements',
        );
        consola.success('Resolved aliases in dependencies!');
    }

    consola.start('Cleaning up...');

    if (existsSync(distDir)) rmSync(distDir, { recursive: true });

    if (existsSync(eruditBuildDir)) rmSync(eruditBuildDir, { recursive: true });

    consola.success('Cleaned up!');

    consola.start('Generating Erudit build files...');

    mkdirSync(eruditBuildDir, { recursive: true });
    mkdirSync(eruditBuildDir + '/nuxt', { recursive: true });

    writeFileSync(
        `${eruditBuildDir}/nuxt/nuxt.config.ts`,
        `
        export default {
            compatibilityDate: '2025-01-01',
            extends: ['${eruditPath}'],
            future: {
                compatibilityVersion: 4,
            },
        }
    `,
    );

    writeFileSync(
        `${eruditBuildDir}/tsconfig.json`,
        JSON.stringify(
            {
                extends: './nuxt/.nuxt/tsconfig.json',
            },
            null,
            4,
        ),
    );

    consola.success('Erudit build files ready!');
}
