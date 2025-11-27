export const katexDependency = {
    katex: {
        optimise: true,
        transpile: true,
    },
};

export function normalizeKatex(katex: string): string {
    katex = katex.replace(/[\s\n]+/g, ' ').trim();
    return katex;
}

export async function latexToHtml(katex: string, mode: 'block' | 'inline') {
    const katexLib = (await import('katex')).default;
    const macros = (await import('./macros.js')).default;

    const html = katexLib.renderToString(katex, {
        displayMode: mode === 'block',
        strict: false,
        macros,
    });

    return html;
}
