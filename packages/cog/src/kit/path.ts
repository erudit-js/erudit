import { join, relative, resolve } from 'node:path';

export function forwardSlashPath(path: string) {
    return path.replace(/\\/g, '/');
}

export function joinPaths(...paths: string[]) {
    return forwardSlashPath(join(...paths));
}

export function resolvePaths(...paths: string[]) {
    return forwardSlashPath(resolve(...paths));
}

export function relativePath(from: string, to: string) {
    return forwardSlashPath(relative(from, to));
}
