import { defineCommand } from 'citty';
import { consola } from 'consola';
import chalk from 'chalk';
import { existsSync } from 'node:fs';

import { resolvePath } from '../shared/path';
import { spawn } from 'node:child_process';

export const launch = defineCommand({
    meta: {
        name: 'Launch',
        description: 'Launch builded Erudit server',
    },
    args: {
        project: {
            type: 'positional',
            description: 'Project path',
            required: false,
            default: '.',
        },
    },
    async run({ args }) {
        consola.start('Resolving project path...');
        const projectPath = resolvePath(args.project);
        consola.success(
            'Resolved project path:',
            chalk.greenBright(projectPath),
        );

        const distPath = `${projectPath}/.output/server`;

        if (!existsSync(distPath))
            throw new Error(
                `No ".output/server" folder found! Did you run 'erudit build'?`,
            );

        spawn(`node index.mjs`, {
            shell: true,
            stdio: 'inherit',
            env: process.env,
            cwd: distPath,
        });
    },
});
