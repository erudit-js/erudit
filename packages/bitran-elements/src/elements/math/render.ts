export async function latexToHtml(latex: string, mode: 'block' | 'inline') {
    const katex = (await import('katex')).default;
    const macros = (await import('./macros')).default;

    const html = katex.renderToString(latex, {
        displayMode: mode === 'block',
        strict: false,
        macros,
    });

    return html;
}

export function ensureMathNotEmpty(math: string) {
    math = math.trim();

    if (!math) {
        throw new Error('Math expression is empty!');
    }
}
