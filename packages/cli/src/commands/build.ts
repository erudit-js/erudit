import consola from 'consola';
import { defineCommand } from 'citty';

import { eruditPathArg, projectPathArg, resolveArgPaths } from '../shared/args';
import { logCommand } from '../shared/log';
import { spawnNuxt } from '../shared/nuxt';
import { prepare } from '../shared/prepare';

export const build = defineCommand({
    meta: {
        name: 'Build',
        description:
            'Builds Erudit project for fast and convenient content writing',
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
        await spawnNuxt('build', projectPath);
    },
});
