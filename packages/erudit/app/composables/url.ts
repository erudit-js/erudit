export function withBaseUrl(path: string): string {
    if (path.startsWith('/')) {
        const baseUrl = ERUDIT.config.project.baseUrl;
        return `${baseUrl}${path.slice(1)}`;
    }

    return path;
}

export function withFullUrl(path?: string): string {
    if (import.meta.server) {
        throw createError({
            statusCode: 500,
            statusMessage: `Full URLs can't be created on the server side!`,
        });
    }

    const fullOrigin = location.origin + withBaseUrl('/');
    const _path = slasher(path || '', { leading: false });

    return fullOrigin + _path;
}
