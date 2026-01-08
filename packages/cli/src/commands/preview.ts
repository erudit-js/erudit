import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { defineCommand } from 'citty';
import { consola } from 'consola';
import chalk from 'chalk';

import { resolvePath } from '../shared/path.js';

export const preview = defineCommand({
    meta: {
        name: 'Preview',
        description: 'Preview builded static Erudit site',
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

        const distPath = `${projectPath}/.output/public`;

        if (!existsSync(distPath)) {
            throw new Error(
                `No ".output/public" folder found! Did you run 'erudit build'?`,
            );
        }

        spawn(`npx http-server ${distPath} -p 3000`, {
            shell: true,
            stdio: 'inherit',
            env: process.env,
        });
    },
});
