import { spawn } from 'node:child_process';
import { existsSync, readdirSync } from 'node:fs';
import { join, relative, sep } from 'node:path';
import { defineCommand } from 'citty';
import chalk from 'chalk';

import { projectPathArg } from '../shared/args.js';
import {
    logProjectPath,
    normalizeProjectPath,
    retrieveProjectPath,
} from '../shared/projectPath.js';
import { cliError } from '../shared/cliError.js';

export const preview = defineCommand({
    meta: {
        name: 'preview',
        description: 'Previews already generated static Erudit site',
    },
    args: {
        ...projectPathArg,
    },
    async run({ args }) {
        const absProjectPath = normalizeProjectPath(
            retrieveProjectPath(args.projectPath),
        );
        logProjectPath(absProjectPath);

        const distPath = `${absProjectPath}/.output/public`;

        const logProjectPathStr = args.projectPath
            ? ` "${args.projectPath}"`
            : '';
        const didYouRun = `Did you run 'erudit generate${logProjectPathStr}'?`;

        if (!existsSync(distPath)) {
            throw cliError(
                `Failed to find generated static Erudit site at "${absProjectPath}"!\n${didYouRun}`,
            );
        }

        const possibleBasePath = findBasePath(distPath);

        if (!possibleBasePath) {
            throw cliError(
                `Failed to find valid entry point (index.html with _nuxt directory) in generated static Erudit site!\n${didYouRun}`,
            );
        }

        console.log(
            `Launching static site preview...\n → ${chalk.underline.cyan(`http://localhost:3000${possibleBasePath}`)}\n`,
        );
        spawn(`http-server ${distPath} -p 3000`, {
            shell: true,
            stdio: 'inherit',
            env: process.env,
        });
    },
});

function findBasePath(rootDir: string): string | null {
    const queue = [rootDir];

    while (queue.length > 0) {
        const currentDir = queue.shift();
        if (!currentDir) continue;

        const hasIndexHtml = existsSync(join(currentDir, 'index.html'));
        const hasNuxtDir = existsSync(join(currentDir, '_nuxt'));

        if (hasIndexHtml && hasNuxtDir) {
            const rel = relative(rootDir, currentDir);
            const urlPath = rel.split(sep).join('/');
            return urlPath ? `/${urlPath}/` : '/';
        }

        try {
            const entries = readdirSync(currentDir, { withFileTypes: true });
            for (const entry of entries) {
                if (entry.isDirectory()) {
                    queue.push(join(currentDir, entry.name));
                }
            }
        } catch {
            continue;
        }
    }

    return null;
}
