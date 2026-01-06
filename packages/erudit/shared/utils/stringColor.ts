export function stringColor(text: string) {
    let hash = 0;

    for (let i = 0; i < text.length; i++) {
        hash = text.charCodeAt(i) + ((hash << 5) - hash);
    }

    const hue = hash % 360;
    const lightColor = `hsl(${hue}, 70%, 35%)`; // Darker for white background
    const darkColor = `hsl(${hue}, 75%, 70%)`; // Lighter for black background

    return `light-dark(${lightColor}, ${darkColor})`;
}
