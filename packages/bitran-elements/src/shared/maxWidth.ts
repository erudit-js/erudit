export function maxWidthCSS(maxWidth: string | undefined): string {
    return maxWidth ? `min(${maxWidth}, 100%)` : '100%';
}
