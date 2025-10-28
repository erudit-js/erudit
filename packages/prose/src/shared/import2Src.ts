export function tryImport2Src(
    extensions: string[],
    path?: string,
): string | undefined {
    if (
        typeof path === 'string' &&
        extensions.some((ext) => path.endsWith(ext))
    ) {
        let resolvedPath = path.replace(/\\/g, '/').replace('file:///', '');
        return `exports.default = ${JSON.stringify(resolvedPath)};`;
    }
}
