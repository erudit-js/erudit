import { ensureMathNotEmpty, latexToHtml } from './render';

export type InlineMathType = 'katex' | 'string';

interface InlineMathBase {
    type: InlineMathType;
}

export interface InlineMathKatex extends InlineMathBase {
    type: 'katex';
    html: string;
}

export interface InlineMathString extends InlineMathBase {
    type: 'string';
    tokens: InlineMathToken[];
}

export type InlineMathData = InlineMathKatex | InlineMathString;
export type InlineMathToken = { type: 'word' | 'other'; value: string };

//
//
//

/**
 * Try to use simple string mode for inline math as it is significantly better for SEO and also faster
 */
export function tryParseMathString(
    expression: string,
): InlineMathString | undefined {
    if (!expression) return undefined;

    const tokens = (() => {
        const hasComplexSymbols = /[\^\\{}_]/gm.test(expression);

        if (hasComplexSymbols) return false;

        const wordRegexp = /(\p{L}+)|([^\p{L}]+)/gu;

        const _tokens: InlineMathToken[] = [];
        let match: RegExpExecArray | null;

        while ((match = wordRegexp.exec(expression)) !== null) {
            if (match[1]) _tokens.push({ type: 'word', value: match[1] });
            else if (match[2]) _tokens.push({ type: 'other', value: match[2] });
        }

        return _tokens;
    })();

    if (tokens)
        return {
            type: 'string',
            tokens,
        };

    return undefined;
}

export async function renderInlineMath(
    expression: string,
): Promise<InlineMathData> {
    ensureMathNotEmpty(expression);

    const tokens = tryParseMathString(expression);
    if (tokens) return tokens;

    return {
        type: 'katex',
        html: await latexToHtml(expression, 'inline'),
    };
}
