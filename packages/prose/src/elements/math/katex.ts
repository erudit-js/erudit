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

    const originalWarn = console.warn;

    // Horrible hack to stop KaTeX complaining about weird characters like emojis
    console.warn = (...args: any[]) => {
        if (
            typeof args[0] === 'string' &&
            args[0].startsWith('No character metrics for ')
        ) {
            return; // swallow it
        }
        originalWarn(...args);
    };

    try {
        return katexLib.renderToString(katex, {
            displayMode: mode === 'block',
            strict: 'ignore',
            macros,
        });
    } finally {
        console.warn = originalWarn; // always restore
    }
}
