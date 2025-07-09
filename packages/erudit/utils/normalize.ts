export function singleSpace(text: string): string {
    return text.replace(/\n/g, ' ').replace(/\s+/g, ' ');
}

export function normalizeText(text: string): string {
    return singleSpace(text).trim();
}
