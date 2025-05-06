export function trailingSlash(path: string, add: boolean): string {
    if (path === '/') {
        return '/';
    }

    if (add) {
        return path.endsWith('/') ? path : `${path}/`;
    }

    return path.endsWith('/') ? path.slice(0, -1) : path;
}
