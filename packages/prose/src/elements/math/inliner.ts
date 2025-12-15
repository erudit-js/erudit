import {
    defineRegistryItem,
    defineSchema,
    ensureTagChild,
    ProseError,
    textSchema,
    type TagChildren,
} from '@jsprose/core';

import { defineEruditTag } from '../../tag.js';
import { latexToHtml, normalizeKatex } from './katex.js';

export type InlinerMathType = 'katex' | 'text';

interface InlinerMathBase {
    type: InlinerMathType;
}

export interface InlinerMathKatex extends InlinerMathBase {
    type: 'katex';
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
 * Try to use simple text mode for inline math as it is significantly better for SEO, faster and smaller.
 */
export function tryTextInlinerMath(
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

export const inlinerMathSchema = defineSchema({
    name: 'inlinerMath',
    type: 'inliner',
    linkable: true,
})<{
    Data: string;
    Storage: InlinerMathStorage;
    Children: undefined;
}>();

export const M = defineEruditTag({
    tagName: 'M',
    schema: inlinerMathSchema,
})<TagChildren>(({ element, tagName, children }) => {
    ensureTagChild(tagName, children, textSchema);
    const katex = normalizeKatex(children[0].data);

    if (!katex) {
        throw new ProseError(
            `<${tagName}> tag must contain non-empty KaTeX math expression.`,
        );
    }

    element.data = katex;
    element.storageKey = `$ ${katex} $`;
});

export const inlinerMathRegistryItem = defineRegistryItem({
    schema: inlinerMathSchema,
    tags: [M],
    async createStorage(element) {
        const tokens = tryTextInlinerMath(element.data);

        if (tokens) {
            return tokens;
        }

        let mathHtml = '<span style="color: red">KaTeX Error!</span>';
        try {
            mathHtml = await latexToHtml(element.data, 'inline');
        } catch (error) {
            console.error('Error while rendering math:', error);
        }

        return {
            type: 'katex',
            mathHtml,
        };
    },
});
