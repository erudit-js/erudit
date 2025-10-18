import { latexToHtml, normalizeKatex } from './katex';
import type { ElementSchema } from '../../schema';
import { ElementType } from '../../type';
import { defineTag } from '../../tag';
import { ProseError } from '../../error';
import { ensureHasOneChild } from '../../children';
import { isTextElement } from '../../default/text';

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

export async function resolveMathGroups(katex: string): Promise<MathGroup> {
    // If whole string does not contain any groups, return default group with rendered math
    if (!katex.includes('>>')) {
        return {
            gap: { type: 'normal' },
            parts: [await latexToHtml(katex, 'block')],
        };
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
    const leftGroup = await resolveMathGroups(leftPart);

    if (typeof leftGroup === 'string') {
        // It is just a rendered math (just two katex strings with gap in between)
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

export const blockMathName = 'blockMath';

export type BlockMathSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof blockMathName;
    Linkable: true;
    Data: { freeze: boolean; katex: string };
    Storage: MathGroup;
    Children: undefined;
}>;

export const BlockMath = defineTag('BlockMath')<
    BlockMathSchema,
    { freeze?: true; children: string }
>({
    type: ElementType.Block,
    name: blockMathName,
    linkable: true,
    initElement({ tagName, element, props, children }) {
        ensureHasOneChild(tagName, children);

        const child = children[0];

        if (!isTextElement(child)) {
            throw new ProseError(
                `<${tagName}> requires exactly one text child element, but received <${children[0].tagName}>!`,
            );
        }

        const katex = normalizeKatex(child.data);

        if (!katex) {
            throw new ProseError(
                `<${tagName}> element must have "latex" prop!`,
            );
        }

        element.data = { freeze: props.freeze ?? false, katex };
        element.storageKey = blockMathName + ': ' + katex;
    },
});
