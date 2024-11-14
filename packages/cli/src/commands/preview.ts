import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { defineCommand } from 'citty';
import { consola } from 'consola';
import chalk from 'chalk';

import { resolvePath } from '../shared/path';

export const preview = defineCommand({
    meta: {
        name: 'Preview',
        description: 'Preview created static Erudit site',
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

        const distPath = `${projectPath}/dist`;

        if (!existsSync(distPath))
            throw new Error(
                `No 'dist' folder found! Did you run 'erudit build'?`,
            );

        spawn('npx http-server . -p 3000', {
            shell: true,
            stdio: 'inherit',
            env: process.env,
            cwd: distPath,
        });
    },
});
