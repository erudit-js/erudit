import { ensureHasOneChild } from '../../children';
import { isTextElement } from '../../default/text';
import { ProseError } from '../../error';
import type { ElementSchema } from '../../schema';
import { defineTag } from '../../tag';
import { ElementType } from '../../type';
import { normalizeKatex } from './katex';

export type InlinerMathType = 'katext' | 'text';

interface InlinerMathBase {
    type: InlinerMathType;
}

export interface InlinerMathKatex extends InlinerMathBase {
    type: 'katext';
    mathHtml: string;
}

export type InlinerMathToken = { type: 'word' | 'other'; value: string };

export interface InlinerMathText extends InlinerMathBase {
    type: 'text';
    tokens: InlinerMathToken[];
}

export type InlinerMathStorage = InlinerMathKatex | InlinerMathText;

/**
 * Apply typographical replacements to improve math rendering
 */
function prettifyMathString(mathString: string): string {
    mathString = mathString
        .replace(/([\w\(\[\)\]])\s*([-+=])\s*([\w\(\[\)\]])/g, '$1 $2 $3')
        .replace(/-/g, '–');

    return mathString;
}

/**
 * Try to use simple string mode for inline math as it is significantly better for SEO and also faster
 */
export function tryParseMathString(
    expression: string,
): InlinerMathText | undefined {
    if (!expression) return undefined;

    expression = prettifyMathString(expression);

    const tokens = (() => {
        const hasComplexSymbols = /[\^\\{}_]/gm.test(expression);

        if (hasComplexSymbols) return false;

        const wordRegexp = /([\p{L}']+)|([^\p{L}']+)/gu;

        const _tokens: InlinerMathToken[] = [];
        let match: RegExpExecArray | null;

        while ((match = wordRegexp.exec(expression)) !== null) {
            if (match[1]) _tokens.push({ type: 'word', value: match[1] });
            else if (match[2]) _tokens.push({ type: 'other', value: match[2] });
        }

        return _tokens;
    })();

    if (tokens) {
        return {
            type: 'text',
            tokens,
        };
    }

    return undefined;
}

//
//
//

export const inlinerMathName = 'inlinerMath';

export type InlinerMathSchema = ElementSchema<{
    Type: ElementType.Inliner;
    Name: typeof inlinerMathName;
    Linkable: true;
    Data: { katex: string };
    Storage: InlinerMathStorage;
    Children: undefined;
}>;

export const M = defineTag('M')<InlinerMathSchema, { children: string }>({
    type: ElementType.Inliner,
    name: inlinerMathName,
    linkable: true,
    initElement({ tagName, element, children }) {
        ensureHasOneChild(tagName, children);

        const child = children[0];

        if (!isTextElement(child)) {
            throw new ProseError(
                `<${tagName}> element can only have text as child!`,
            );
        }

        const katex = normalizeKatex(child.data);

        if (!katex) {
            throw new ProseError(`<${tagName}> element cannot be empty!`);
        }

        element.data = { katex };
        element.storageKey = inlinerMathName + ': ' + katex;
    },
});
