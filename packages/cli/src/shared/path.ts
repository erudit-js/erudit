import { consola } from 'consola';
import chalk from 'chalk';
import { existsSync, lstatSync } from 'node:fs';
import { resolvePaths } from '@erudit-js/cog/kit';

export function resolvePath(path: string): string {
    path = resolvePaths(path);
    path = path.endsWith('/') ? path.slice(0, -1) : path;

    if (existsSync(path) && !lstatSync(path).isDirectory())
        throw new Error(
            `Path "${chalk.yellowBright(path)}" is not a directory!`,
        );

    return path;
}
