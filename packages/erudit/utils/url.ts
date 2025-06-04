export function trailingSlash(path: string, add: boolean): string {
    if (path === '/') {
        return '/';
    }

    if (add) {
        return path.endsWith('/') ? path : `${path}/`;
    }

    return path.endsWith('/') ? path.slice(0, -1) : path;
}

export function normalizeUrl(url: string): string {
    // Handle protocol and origin separately
    const protocolMatch = url.match(/^([a-z][a-z\d+\-.]*:\/\/[^\/]+)/i);
    const protocol = protocolMatch ? protocolMatch[1] : '';
    const pathPart = protocol ? url.slice(protocol.length) : url;

    // Normalize path by removing empty segments
    const normalizedPath = pathPart.replace(/\/+/g, '/');

    return protocol + normalizedPath;
}
