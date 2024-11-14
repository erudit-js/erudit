import { consola } from 'consola';
import { defineCommand } from 'citty';

import { logCommand } from '../shared/log';
import { prepare } from '../shared/prepare';
import { spawnNuxt } from '../shared/nuxt';
import { eruditPathArg, projectPathArg, resolveArgPaths } from '../shared/args';

export const build = defineCommand({
    meta: {
        name: 'Build',
        description: 'Generates fully static Erudit site',
    },
    args: {
        ...projectPathArg,
        ...eruditPathArg,
    },
    async run({ args }) {
        logCommand('build');

        const { projectPath, eruditPath } = resolveArgPaths(
            args.projectPath,
            args.eruditPath,
        );

        await prepare(projectPath, eruditPath);

        consola.start('Starting Nuxt build...');
        await spawnNuxt('generate', projectPath);
    },
});
