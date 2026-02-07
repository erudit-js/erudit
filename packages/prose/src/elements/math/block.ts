import {
  defineRegistryItem,
  defineSchema,
  ensureTagChild,
  ProseError,
  textSchema,
  type TagChildren,
} from '@jsprose/core';

import { latexToHtml, normalizeKatex } from './katex.js';
import { defineEruditTag } from '../../tag.js';

export const mathGroupTypes = ['0', 'small', 'normal', 'big'] as const;
export type MathGroupGapType = (typeof mathGroupTypes)[number] | 'custom';

export type MathGroupAlignItems = 'top' | 'center' | 'bottom';

const alignValues = ['top', 'center', 'bottom'] as const;

export interface MathGroupGapTemplate {
  type: MathGroupGapType;
}

export interface MathGroupGapZero extends MathGroupGapTemplate {
  type: '0';
}
export interface MathGroupGapSmall extends MathGroupGapTemplate {
  type: 'small';
}
export interface MathGroupGapNormal extends MathGroupGapTemplate {
  type: 'normal';
}
export interface MathGroupGapBig extends MathGroupGapTemplate {
  type: 'big';
}
export interface MathGroupGapCustom extends MathGroupGapTemplate {
  type: 'custom';
  size: string;
}

export type MathGroupGap =
  | MathGroupGapZero
  | MathGroupGapSmall
  | MathGroupGapNormal
  | MathGroupGapBig
  | MathGroupGapCustom;

export type MathGroupPart = string | MathGroup;

export interface MathGroup {
  gap: MathGroupGap;
  alignItems?: MathGroupAlignItems;
  parts: MathGroupPart[];
}

function isAlignValue(value: string): value is MathGroupAlignItems {
  return (alignValues as readonly string[]).includes(value);
}

function gapFromString(str: string): MathGroupGap {
  if (mathGroupTypes.includes(str as any)) {
    return { type: str as (typeof mathGroupTypes)[number] };
  }

  return { type: 'custom', size: str };
}

function gapsEqual(gap1: MathGroupGap, gap2: MathGroupGap): boolean {
  if (gap1.type !== gap2.type) return false;
  if (gap1.type === 'custom' && gap2.type === 'custom') {
    return gap1.size === gap2.size;
  }
  return true;
}

export async function resolveMathGroups(
  katex: string,
  isTopLevel = true,
): Promise<MathGroup | string> {
  if (!katex.includes('>>')) {
    const rendered = await latexToHtml(katex, 'block');

    if (isTopLevel) {
      return {
        gap: { type: 'normal' },
        parts: [rendered],
      };
    }

    return rendered;
  }

  const delimiterRegex = />>(?:\{([^}]+)\})?(?:\{([^}]+)\})?/g;
  let match: RegExpExecArray | null;
  let last!: RegExpExecArray;

  while ((match = delimiterRegex.exec(katex)) !== null) {
    last = match;
  }

  const raw1 = last[1];
  const raw2 = last[2];

  let gap: MathGroupGap = { type: 'normal' };
  let alignItems: MathGroupAlignItems | undefined;

  // ---- Resolution rules ----
  if (raw1 && raw2) {
    // >>{gap}{align}
    gap = gapFromString(raw1);
    if (isAlignValue(raw2)) alignItems = raw2;
  } else if (raw1) {
    // >>{something}
    if (isAlignValue(raw1)) {
      // >>{center}
      alignItems = raw1;
    } else {
      // >>{small} or custom gap
      gap = gapFromString(raw1);
    }
  }

  const delimiterPos = last.index;
  const delimiterLen = last[0].length;

  const left = katex.slice(0, delimiterPos);
  const right = katex.slice(delimiterPos + delimiterLen);

  const parts: MathGroupPart[] = [await latexToHtml(right, 'block')];

  const leftGroup = await resolveMathGroups(left, false);

  if (typeof leftGroup === 'string') {
    parts.unshift(leftGroup);
  } else {
    if (gapsEqual(leftGroup.gap, gap)) {
      parts.unshift(...leftGroup.parts);
    } else {
      parts.unshift(leftGroup);
    }
  }

  return {
    gap,
    ...(alignItems ? { alignItems } : {}),
    parts,
  };
}

export interface BlockMathData {
  katex: string;
  freeze?: boolean;
}

export const blockMathSchema = defineSchema({
  name: 'blockMath',
  type: 'block',
  linkable: true,
})<{
  Data: BlockMathData;
  Storage: MathGroup;
  Children: undefined;
}>();

export const BlockMath = defineEruditTag({
  tagName: 'BlockMath',
  schema: blockMathSchema,
})<{ freeze?: boolean } & TagChildren>(({
  element,
  tagName,
  props,
  children,
}) => {
  ensureTagChild(tagName, children, textSchema);

  const katex = normalizeKatex(children[0].data);

  if (!katex) {
    throw new ProseError(
      `<${tagName}> tag must contain non-empty KaTeX math expression.`,
    );
  }

  element.data = {
    katex,
    freeze: props.freeze === true,
  };

  element.storageKey = `$$ ${katex} $$`;
});

export const blockMathRegistryItem = defineRegistryItem({
  schema: blockMathSchema,
  tags: [BlockMath],
  async createStorage(element) {
    return createBlockMathStorage(element.data.katex);
  },
});

export async function createBlockMathStorage(
  katex: string,
): Promise<MathGroup> {
  let result: MathGroup = {
    gap: { type: 'normal' },
    parts: ['<span style="color: red">KaTeX Error!</span>'],
  };

  try {
    result = (await resolveMathGroups(katex)) as MathGroup;
  } catch (error) {
    console.error('Error while rendering math:', error);
  }

  return result;
}
