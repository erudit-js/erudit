import {
  defineSchema,
  ensureTagChildren,
  textSchema,
  type RequiredChildren,
  type Schema,
} from 'tsprose';

import { defineEruditTag } from '../../tag.js';
import { katexDependency, latexToHtml, normalizeKatex } from './katex.js';
import { EruditProseError } from '../../error.js';
import { defineProseCoreElement } from '../../coreElement.js';

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

export interface InlinerMathSchema extends Schema {
  name: 'inlinerMath';
  type: 'inliner';
  linkable: true;
  Data: string;
  Storage: InlinerMathStorage;
  Children: undefined;
}

export const inlinerMathSchema = defineSchema<InlinerMathSchema>({
  name: 'inlinerMath',
  type: 'inliner',
  linkable: true,
});

export const M = defineEruditTag({
  tagName: 'M',
  schema: inlinerMathSchema,
})<RequiredChildren>(({ element, tagName, children }) => {
  ensureTagChildren(tagName, children, textSchema);
  const katex = normalizeKatex(children[0].data);

  if (!katex) {
    throw new EruditProseError(
      `<${tagName}> tag must contain non-empty KaTeX math expression.`,
    );
  }

  element.data = katex;
  element.storageKey = `$ ${katex} $`;
});

export const inlinerMathCoreElement = defineProseCoreElement({
  schema: inlinerMathSchema,
  tags: [M],
  createStorage: async (element) => createInlinerMathStorage(element.data),
  dependencies: katexDependency,
});

export async function createInlinerMathStorage(
  katex: string,
): Promise<InlinerMathStorage> {
  const tokens = tryTextInlinerMath(katex);

  if (tokens) {
    return tokens;
  }

  let mathHtml = '<span style="color: red">KaTeX Error!</span>';
  try {
    mathHtml = await latexToHtml(katex, 'inline');
  } catch (error) {
    console.error('Error while rendering math:', error);
  }

  return {
    type: 'katex',
    mathHtml,
  };
}
