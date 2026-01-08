import { defineCommand } from 'citty';
import { consola } from 'consola';
import chalk from 'chalk';
import {
    existsSync,
    mkdirSync,
    readdirSync,
    rmSync,
    writeFileSync,
} from 'node:fs';

import { resolvePath } from '../shared/path.js';

export const init = defineCommand({
    meta: {
        name: 'Init',
        description: 'Creates a new Erudit project at specified path',
    },
    args: {
        path: {
            type: 'positional',
            description: 'Path for the new Erudit project',
            required: true,
            valueHint: chalk.gray(
                `"${chalk.greenBright('.')}" OR "${chalk.greenBright('path/to/project')}"`,
            ),
        },
    },
    async run({ args }) {
        consola.start('Resolving project path...');

        const projectPath = resolvePath(args.path);

        if (projectPath === undefined) return;

        if (existsSync(projectPath) && readdirSync(projectPath).length > 0)
            throw new Error(
                `Directory "${chalk.yellowBright(projectPath)}" is not empty!`,
            );

        consola.success(
            'Resolved project path:',
            chalk.greenBright(projectPath),
        );

        consola.start('Creating project directory...');

        try {
            try {
                rmSync(projectPath, { recursive: true });
            } catch (error: any) {
                if (error?.code !== 'ENOENT') {
                    throw error;
                }
            }

            mkdirSync(projectPath, { recursive: true });
        } catch (error) {
            throw new Error(
                `Failed to prepare project directory "${chalk.yellowBright(projectPath)}"!\n\n${error}`,
            );
        }

        consola.success('Project directory created!');

        consola.start('Creating project files...');

        consola.success('Project files created!');
    },
});

function createPackageJson(projectPath: string) {
    // TODO: Get correct package versions

    writeFileSync(
        `${projectPath}/package.json`,
        JSON.stringify({
            private: true,
            name: projectPath.split('/').pop() || 'my-erudit-project',
            type: 'module',
            scripts: {
                dev: 'erudit dev',
                build: 'erudit build',
                preview: 'erudit preview',
                prepare: 'erudit prepare',
            },
        }),
    );
}
