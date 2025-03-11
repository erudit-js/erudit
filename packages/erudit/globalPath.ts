import { fileURLToPath } from 'node:url';
import { resolvePaths } from '@erudit-js/cog/kit';

export const ERUDIT_DIR = resolvePaths(fileURLToPath(import.meta.url), '..');
export const PROJECT_DIR = process.env.ERUDIT_PROJECT_DIR as string;

export function eruditPath(path?: string) {
    return path ? `${ERUDIT_DIR}/${path}` : ERUDIT_DIR;
}

export function projectPath(path?: string) {
    return path ? `${PROJECT_DIR}/${path}` : PROJECT_DIR;
}

export function eruditBuildPath(path?: string) {
    return projectPath('.erudit' + (path ? '/' + path : ''));
}

export function eruditEndNuxtPath(path?: string) {
    return eruditBuildPath('nuxt' + (path ? '/' + path : ''));
}
