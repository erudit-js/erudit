export function extractTagDocs(tag: string, docsContent: string) {
    const blocks = docsContent.match(/\/\*\*[\s\S]*?\*\//g);

    if (!blocks) {
        return;
    }

    for (const block of blocks) {
        // After the JSDoc block, match the following JS statement (e.g., let M, Problem...)
        const after = docsContent.slice(
            docsContent.indexOf(block) + block.length,
        );

        // Match trailing variable declarations after this block
        // e.g.: let A;   OR   let A, B, C;   OR on multiple lines
        const declMatch = after.match(/^\s*let\s+([^;]+);/);
        if (!declMatch) {
            continue;
        }

        // Extract all declared names
        const names = declMatch[1]
            .split(',')
            .map((n) => n.trim())
            .filter(Boolean);

        // Found?
        if (names.includes(tag)) {
            return block;
        }
    }
}
