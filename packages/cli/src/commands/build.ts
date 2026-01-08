import consola from 'consola';
import { defineCommand } from 'citty';

import {
    contentTargetsArg,
    eruditPathArg,
    nitroPresetArg,
    projectPathArg,
    resolveArgPaths,
} from '../shared/args.js';
import { logCommand } from '../shared/log.js';
import { spawnNuxt } from '../shared/nuxt.js';
import { prepare } from '../shared/prepare.js';

export const build = defineCommand({
    meta: {
        name: 'Build',
        description:
            'Builds Erudit project for fast and convenient content writing',
    },
    args: {
        ...projectPathArg,
        ...eruditPathArg,
        ...contentTargetsArg,
        ...nitroPresetArg,
        prerender: {
            required: false,
            type: 'boolean',
            default: false,
            description: '(Nuxt Build Flag) Prerender routes',
        },
    },
    async run({ args }) {
        logCommand('build');

        const { projectPath, eruditPath } = resolveArgPaths(
            args.projectPath,
            args.eruditPath,
        );

        await prepare({
            projectPath,
            eruditPath,
            contentTargets: args.target,
        });

        const restParams =
            (args.prerender ? '--prerender' : '') +
            (args.preset ? ` --preset ${args.preset}` : '');

        consola.start('Starting Nuxt build...');
        await spawnNuxt('build', projectPath, restParams);
    },
});
