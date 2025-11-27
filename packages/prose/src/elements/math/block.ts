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

export const mathGroupTypes = ['zero', 'normal', 'big'] as const;
export type MathGroupGapType = (typeof mathGroupTypes)[number] | 'custom';

export interface MathGroupGapTemplate {
    type: MathGroupGapType;
}

export interface MathGroupGapNone extends MathGroupGapTemplate {
    type: 'zero';
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
    | MathGroupGapNone
    | MathGroupGapNormal
    | MathGroupGapBig
    | MathGroupGapCustom;

export type MathGroupPart = string | MathGroup;

export interface MathGroup {
    gap: MathGroupGap;
    parts: MathGroupPart[];
}

function gapFromString(strGap: string): MathGroupGap {
    if (mathGroupTypes.includes(strGap as (typeof mathGroupTypes)[number])) {
        return { type: strGap as (typeof mathGroupTypes)[number] };
    }

    return { type: 'custom', size: strGap };
}

function gapsEqual(gap1: MathGroupGap, gap2: MathGroupGap): boolean {
    if (gap1.type !== gap2.type) {
        return false;
    }

    if (gap1.type === 'custom' && gap2.type === 'custom') {
        return gap1.size === gap2.size;
    }

    return true;
}

export async function resolveMathGroups(
    katex: string,
    isTopLevel = true,
): Promise<MathGroup | string> {
    // If whole string does not contain any groups, return default group with rendered math
    if (!katex.includes('>>')) {
        const rendered = await latexToHtml(katex, 'block');

        if (isTopLevel) {
            // Only top-level should return a group
            return {
                gap: { type: 'normal' },
                parts: [rendered],
            };
        }

        // Recursive left side should return a plain string
        return rendered;
    }
    // Find the rightmost delimiter and its gap specification
    const delimiterRegex = />>(?:\{([^}]+)\})?/g;
    let match: RegExpExecArray | null;
    let lastDelimiterMatch!: RegExpExecArray;

    while ((match = delimiterRegex.exec(katex)) !== null) {
        lastDelimiterMatch = match;
    }

    // Extract gap
    const gap = gapFromString(lastDelimiterMatch[1] || 'normal');

    // Calculate positions
    const lastDelimiterPos = lastDelimiterMatch.index;
    const lastDelimiterLen = lastDelimiterMatch[0].length;

    // Split the katex string
    const leftPart = katex.slice(0, lastDelimiterPos);
    const rightPart = katex.slice(lastDelimiterPos + lastDelimiterLen);

    // Pushing rendered right part
    const parts: MathGroupPart[] = [await latexToHtml(rightPart, 'block')];

    // Resolving left part
    const leftGroup = await resolveMathGroups(leftPart, false);

    if (typeof leftGroup === 'string') {
        parts.unshift(leftGroup);
    } else {
        // Left part is a group, meaning it contains gaps
        if (gapsEqual(leftGroup.gap, gap)) {
            // If gaps are equal, we can merge the two groups into (current) one
            parts.unshift(...leftGroup.parts);
        } else {
            // Gaps are different, we need to keep the left group as is
            parts.unshift(leftGroup);
        }
    }

    return {
        gap,
        parts,
    };
}

//
//
//

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

    element.storageKey = `$$${katex}$$`;
});

export const blockMathRegistryItem = defineRegistryItem({
    schema: blockMathSchema,
    tags: [BlockMath],
    async createStorage(element) {
        let result: MathGroup = {
            gap: { type: 'normal' },
            parts: ['<span style="color: red">KaTeX Error!</span>'],
        };

        try {
            result = (await resolveMathGroups(element.data.katex)) as MathGroup;
        } catch (error) {
            console.error('Error while rendering math:', error);
        }

        return result;
    },
});
