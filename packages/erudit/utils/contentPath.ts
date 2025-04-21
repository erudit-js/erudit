import { readdirSync, statSync } from 'fs';

// A directory is considered a "content directory" if it contains book, group, or topic with a file having a .js or .ts extension.
// When a directory qualifies as a content directory, its name is simplified by removing any leading digits and a '+' or '-' (e.g., "29+foo" becomes "foo").

const contentFileRegex = /^(book|group|topic)\.(js|ts)$/i;

function normalizePath(path: string): string {
    return path.replace(/\\/g, '/');
}

export function isContentDirectory(directory: string): boolean {
    if (!statSync(directory).isDirectory()) {
        return false;
    }

    return readdirSync(directory).some((file) => {
        return contentFileRegex.test(file);
    });
}

export function getContentPath(path: string, cwd?: string): string {
    path = normalizePath(path);
    cwd = cwd ? normalizePath(cwd) : undefined;

    const unresolvedParts = path.split('/').filter(Boolean);
    const resolvedParts: string[] = [];

    let currentPath = cwd || '';
    while (unresolvedParts.length) {
        const currentPart = unresolvedParts.shift()!;
        currentPath += '/' + currentPart;
        if (isContentDirectory(currentPath)) {
            resolvedParts.push(currentPart.replace(/^\d+(?:\+|-)/, ''));
        } else {
            resolvedParts.push(currentPart);
        }
    }

    return resolvedParts.join('/');
}

export function scanContentPaths(directory: string): Record<string, string> {
    directory = normalizePath(directory);

    const map: Record<string, string> = {};

    function traverse(currentPath: string) {
        const files = readdirSync(currentPath);

        for (const file of files) {
            const fullPath = currentPath + '/' + file;
            const relativePath = fullPath.slice(directory.length + 1);
            const stat = statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath);
            } else {
                map[getContentPath(relativePath, directory)] = relativePath;
            }
        }
    }

    traverse(directory);

    return map;
}
