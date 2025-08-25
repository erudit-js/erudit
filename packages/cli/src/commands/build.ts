import consola from 'consola';
import { defineCommand } from 'citty';

import {
    contentTargetsArg,
    eruditPathArg,
    projectPathArg,
    resolveArgPaths,
} from '../shared/args';
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
        ...contentTargetsArg,
        prerender: {
            required: false,
            type: 'boolean',
            default: false,
            description: '(Nuxt Build Flag) Prerender routes',
        },
        preset: {
            required: false,
            type: 'string',
            description: '(Nuxt Build Flag) Nitro preset to use for building',
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
