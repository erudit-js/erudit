export function stringColor(text: string) {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    return `hsl(${hash % 360}, 85%, 35%)`;
}
