import { readFileSync } from 'node:fs';

const mimeByExt: Record<string, string> = {
    '.svg': 'image/svg+xml; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.txt': 'text/plain; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.html': 'text/html; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
};

function getMime(path: string): string {
    const dot = path.lastIndexOf('.');
    if (dot === -1) return 'application/octet-stream';
    const ext = path.slice(dot).toLowerCase();
    return mimeByExt[ext] || 'application/octet-stream';
}

export function serveStaticFile(event: any, path: string) {
    const data = readFileSync(path);
    event.node.res.setHeader('Content-Type', getMime(path));
    return data;
}
