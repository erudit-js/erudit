import { consola } from 'consola';
import { defineCommand } from 'citty';

import { logCommand } from '../shared/log';
import { prepare } from '../shared/prepare';
import { spawnNuxt } from '../shared/nuxt';
import { eruditPathArg, projectPathArg, resolveArgPaths } from '../shared/args';

export const dev = defineCommand({
    meta: {
        name: 'Dev',
        description: 'Runs Erudit project in development mode',
    },
    args: {
        ...projectPathArg,
        ...eruditPathArg,
    },
    async run({ args }) {
        logCommand('dev');

        const { projectPath, eruditPath } = resolveArgPaths(
            args.projectPath,
            args.eruditPath,
        );

        await prepare(projectPath, eruditPath);

        consola.start('Starting Nuxt dev...');
        await spawnNuxt('dev', projectPath);
    },
});
