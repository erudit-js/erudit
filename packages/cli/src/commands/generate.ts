import { defineCommand } from 'citty';

import {
    contentTargetsArg,
    eruditPathArg,
    nitroPresetArg,
    projectPathArg,
    resolveArgPaths,
} from '../shared/args.js';
import { logCommand } from '../shared/log.js';
import { prepare } from '../shared/prepare.js';
import { spawnNuxt } from '../shared/nuxt.js';

export const generate = defineCommand({
    meta: {
        name: 'Generate',
        description:
            'Generates static production-ready site from Erudit project',
    },
    args: {
        ...projectPathArg,
        ...eruditPathArg,
        ...contentTargetsArg,
        ...nitroPresetArg,
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

        const restParams = args.preset ? `--preset ${args.preset}` : '';

        console.log('Starting Nuxt generate...');
        await spawnNuxt('generate', projectPath, restParams);
    },
});
