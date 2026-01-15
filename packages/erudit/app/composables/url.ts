export function withBaseUrl(path: string): string {
    if (path.startsWith('/')) {
        const baseUrl = ERUDIT.config.project.baseUrl;
        return `${baseUrl}${path.slice(1)}`;
    }

    return path;
}

export function withFullUrl(path?: string): string {
    // Return external URLs as is
    if (path) {
        if (!path.startsWith('/')) {
            return path;
        }
    }

    const originUrl = ERUDIT.config.project.originUrl;
    const fullUrl = slasher(originUrl + withBaseUrl('/') + (path || ''));

    return fullUrl;
}
