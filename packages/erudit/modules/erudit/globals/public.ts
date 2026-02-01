import { sn } from 'unslash';

export const PUBLIC_PROJECT_BASE_URL = '/public/project/';
export const PUBLIC_ERUDIT_BASE_URL = '/public/erudit/';

/**
 * Target static files located in `<project_dir>/public` folder.
 */
export function projectPublic(path: string) {
    return sn(PUBLIC_PROJECT_BASE_URL, path);
}

/**
 * Target static files located in `<erudit_package>/public` folder.
 */
export function eruditPublic(path: string) {
    return sn(PUBLIC_ERUDIT_BASE_URL, path);
}
