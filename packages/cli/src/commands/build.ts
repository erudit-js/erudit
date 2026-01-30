import { rmSync } from 'node:fs';
import consola from 'consola';
import { defineCommand } from 'citty';

import {
    contentTargetsArg,
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
        ...contentTargetsArg,
        ...nitroPresetArg,
    },
    async run({ args }) {
        logCommand('build');

        const { projectPath } = resolveArgPaths(args.projectPath);

        await prepare({
            projectPath,
            contentTargets: args.target,
        });

        const restParams = args.preset ? ` --preset ${args.preset}` : '';

        consola.start('Starting Nuxt build...');
        await spawnNuxt('build', projectPath, restParams);

        // Just fucking remove @jsprose because not a single fucking option inside Nuxt/Nitro allows NOT TO bundle it!
        rmSync(`${projectPath}/.output/server/node_modules/@jsprose`, {
            recursive: true,
            force: true,
        });
    },
});
