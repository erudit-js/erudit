import { describe, expect, test } from 'vitest';

import { resolveMathGroups } from 'src/elements/math/block';
import type { MathGroup, MathGroupPart } from 'src/elements/math/block';

function isGroup(part: MathGroupPart): part is MathGroup {
    return (
        typeof part === 'object' &&
        part !== null &&
        'gap' in part &&
        'parts' in part
    );
}

function expectAllStrings(parts: MathGroupPart[]) {
    parts.forEach((p) => {
        if (isGroup(p)) {
            expect(Array.isArray(p.parts)).toBe(true);
            expectAllStrings(p.parts);
        } else {
            expect(typeof p).toBe('string');
        }
    });
}

describe('resolveMathGroups', () => {
    test('empty string', async () => {
        await expect(resolveMathGroups('')).rejects.toThrow();
    });

    test('simple text no delimiters', async () => {
        const result = await resolveMathGroups('x + y = z');
        expect(result.gap.type).toBe('normal');
        expect(result.parts).toHaveLength(1);
        expectAllStrings(result.parts);
    });

    test('split by simple delimiter', async () => {
        const result = await resolveMathGroups(
            '(a+b)^1 >> (a+b)^2 >> (a+b)^3 >> (a+b)^4 >> (a+b)^5',
        );
        expect(result.gap.type).toBe('normal');
        expect(result.parts).toHaveLength(5);
        expectAllStrings(result.parts);
    });

    test('gap specification named', async () => {
        const result = await resolveMathGroups('a >>{zero} b');
        expect(result.gap.type).toBe('zero');
        expect(result.parts).toHaveLength(2);
        expectAllStrings(result.parts);
    });

    test('gap specification custom', async () => {
        const result = await resolveMathGroups('a >>{30px} b');
        expect(result.gap.type).toBe('custom');
        if (result.gap.type === 'custom') expect(result.gap.size).toBe('30px');
        expect(result.parts).toHaveLength(2);
        expectAllStrings(result.parts);
    });

    test('nested groups simple', async () => {
        const result = await resolveMathGroups('a >> b >>{zero} c');
        expect(result.gap.type).toBe('zero');
        expect(result.parts).toHaveLength(2);
        const first = result.parts[0]!;
        const second = result.parts[1]!;
        expect(isGroup(first)).toBe(true);
        expect(typeof second).toBe('string');
        if (isGroup(first)) {
            expect(first.gap.type).toBe('normal');
            expect(first.parts).toHaveLength(2);
            expectAllStrings(first.parts);
        }
    });

    test('multiple parts same gap with nesting', async () => {
        const result = await resolveMathGroups(
            '(a+b)^1 >> (a+b)^2 >> (a+b)^3 >>{30px} (a+b)^4 >>{30px} (a+b)^5',
        );
        expect(result.gap.type).toBe('custom');
        if (result.gap.type === 'custom') expect(result.gap.size).toBe('30px');
        expect(result.parts).toHaveLength(3);

        const first = result.parts[0]!;
        const second = result.parts[1]!;
        const third = result.parts[2]!;
        expect(isGroup(first)).toBe(true);
        if (isGroup(first)) {
            expect(first.gap.type).toBe('normal');
            expect(first.parts).toHaveLength(3);
            expectAllStrings(first.parts);
        }
        expect(typeof second).toBe('string');
        expect(typeof third).toBe('string');
    });

    test('complex nested groups', async () => {
        const result = await resolveMathGroups('a >>{big} b >> c >>{zero} d');
        expect(result.gap.type).toBe('zero');
        expect(result.parts).toHaveLength(2);

        const left = result.parts[0]!;
        const right = result.parts[1]!;
        expect(isGroup(left)).toBe(true);
        expect(typeof right).toBe('string');

        if (isGroup(left)) {
            expect(left.gap.type).toBe('normal');
            expect(left.parts).toHaveLength(2);

            const innerGroup = left.parts[0]!;
            const innerString = left.parts[1]!;
            expect(isGroup(innerGroup)).toBe(true);
            expect(typeof innerString).toBe('string');

            if (isGroup(innerGroup)) {
                expect(innerGroup.gap.type).toBe('big');
                expect(innerGroup.parts).toHaveLength(2);
                expectAllStrings(innerGroup.parts);
            }
        }
    });
});
