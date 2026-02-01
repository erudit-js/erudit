import { existsSync, lstatSync } from 'node:fs';
import { isAbsolute, resolve } from 'node:path';
import chalk from 'chalk';

export function absPath(path: string): string {
    const normalize = (p: string) => p.replaceAll('\\', '/');

    path = normalize(path);
    if (!isAbsolute(path)) {
        path = normalize(resolve(process.cwd(), path));
    }

    return path;
}

export function absPathEnsured(path: string): string {
    const abs = absPath(path);

    if (!existsSync(abs)) {
        throw new Error(chalk.red(`Path does not exist: ${abs}`));
    }

    return abs;
}

export function absDirectoryEnsured(path: string): string {
    const abs = absPathEnsured(path);

    if (!lstatSync(abs).isDirectory()) {
        throw new Error(chalk.red(`Path is not a directory: ${abs}`));
    }

    return abs;
}
