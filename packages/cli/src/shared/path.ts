import { existsSync, lstatSync } from 'node:fs';
import chalk from 'chalk';
import { resolve, isAbsolute } from 'node:path';

export function resolvePath(path: string): string {
    path = path.replace(/\\/g, '/');
    path = path.endsWith('/') ? path.slice(0, -1) : path;

    if (!isAbsolute(path)) {
        path = resolve(process.cwd(), path).replace(/\\/g, '/');
    }

    if (existsSync(path) && !lstatSync(path).isDirectory())
        throw new Error(
            `Path "${chalk.yellowBright(path)}" is not a directory!`,
        );

    return path;
}
