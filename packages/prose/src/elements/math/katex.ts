import { ProseError } from '../../error';

export async function latexToHtml(katex: string, mode: 'block' | 'inline') {
    ensureKatexNotEmpty(katex);

    const katexLib = (await import('katex')).default;
    const macros = (await import('./macros')).default;

    const html = katexLib.renderToString(katex, {
        displayMode: mode === 'block',
        strict: false,
        macros,
    });

    return html;
}

export function ensureKatexNotEmpty(katex: string) {
    katex = katex.trim();

    if (!katex) {
        throw new ProseError('Math expression is empty!');
    }
}
