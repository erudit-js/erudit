import { consola } from 'consola';
import { defineCommand } from 'citty';

import { logCommand } from '../shared/log';
import { prepare } from '../shared/prepare';
import { spawnNuxt } from '../shared/nuxt';
import {
    contentTargetsArg,
    eruditPathArg,
    projectPathArg,
    resolveArgPaths,
} from '../shared/args';

export const generate = defineCommand({
    meta: {
        name: 'Generate',
        description: 'Generates fully static production ready Erudit site',
    },
    args: {
        ...projectPathArg,
        ...eruditPathArg,
        ...contentTargetsArg,
    },
    async run({ args }) {
        logCommand('generate');

        const { projectPath, eruditPath } = resolveArgPaths(
            args.projectPath,
            args.eruditPath,
        );

        await prepare({
            projectPath,
            eruditPath,
            contentTargets: args.target,
        });

        consola.start('Starting Nuxt generate...');
        await spawnNuxt('generate', projectPath);
    },
});
