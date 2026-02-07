import { describe, expect, it, vi } from 'vitest';
import { isolateProse, isRawElement, PROSE_REGISTRY } from '@jsprose/core';

vi.mock('@erudit-js/prose/elements/math/katex.js', async (importOriginal) => {
  const original = (await importOriginal()) as any;
  return {
    ...original,
    latexToHtml: vi.fn(async (str: string) => str.trim()),
  };
});

import { asEruditRaw } from '@erudit-js/prose';
import {
  BlockMath,
  blockMathRegistryItem,
  blockMathSchema,
  resolveMathGroups,
} from '@erudit-js/prose/elements/math/block';

describe('resolveMathGroups', () => {
  it('should handle empty string', async () => {
    const result = await resolveMathGroups('');
    expect(result).toEqual({
      gap: { type: 'normal' },
      parts: [''],
    });
  });

  it('should handle simple text with no delimiters', async () => {
    const result = await resolveMathGroups('x + y = z');
    expect(result).toEqual({
      gap: { type: 'normal' },
      parts: ['x + y = z'],
    });
  });

  it('should split by simple delimiter', async () => {
    const result = await resolveMathGroups(
      '(a+b)^1 >> (a+b)^2 >> (a+b)^3 >> (a+b)^4 >> (a+b)^5',
    );
    expect(result).toEqual({
      gap: { type: 'normal' },
      parts: ['(a+b)^1', '(a+b)^2', '(a+b)^3', '(a+b)^4', '(a+b)^5'],
    });
  });

  it('should handle gap specification (named gap)', async () => {
    const result = await resolveMathGroups('a >>{small} b');
    expect(result).toEqual({
      gap: { type: 'small' },
      parts: ['a', 'b'],
    });
  });

  it('should handle custom gap size', async () => {
    const result = await resolveMathGroups('a >>{30px} b');
    expect(result).toEqual({
      gap: { type: 'custom', size: '30px' },
      parts: ['a', 'b'],
    });
  });

  it('should handle alignment-only syntax', async () => {
    const result = await resolveMathGroups('a >>{center} b');
    expect(result).toEqual({
      gap: { type: 'normal' },
      alignItems: 'center',
      parts: ['a', 'b'],
    });
  });

  it('should handle gap + alignment', async () => {
    const result = await resolveMathGroups('a >>{small}{bottom} b');
    expect(result).toEqual({
      gap: { type: 'small' },
      alignItems: 'bottom',
      parts: ['a', 'b'],
    });
  });

  it('should ignore invalid alignment value', async () => {
    const result = await resolveMathGroups('a >>{small}{invalid} b');
    expect(result).toEqual({
      gap: { type: 'small' },
      parts: ['a', 'b'],
    });
  });

  it('should handle nested groups', async () => {
    const result = await resolveMathGroups('a >> b >>{small} c');
    expect(result).toEqual({
      gap: { type: 'small' },
      parts: [
        {
          gap: { type: 'normal' },
          parts: ['a', 'b'],
        },
        'c',
      ],
    });
  });

  it('should handle multiple parts with same gap and nesting', async () => {
    const result = await resolveMathGroups(
      '(a+b)^1 >> (a+b)^2 >> (a+b)^3 >>{30px} (a+b)^4 >>{30px} (a+b)^5',
    );
    expect(result).toEqual({
      gap: { type: 'custom', size: '30px' },
      parts: [
        {
          gap: { type: 'normal' },
          parts: ['(a+b)^1', '(a+b)^2', '(a+b)^3'],
        },
        '(a+b)^4',
        '(a+b)^5',
      ],
    });
  });

  it('should handle complex nested groups with alignment', async () => {
    const result = await resolveMathGroups(
      'a >>{big}{center} b >> c >>{small}{bottom} d',
    );
    expect(result).toEqual({
      gap: { type: 'small' },
      alignItems: 'bottom',
      parts: [
        {
          gap: { type: 'normal' },
          parts: [
            {
              gap: { type: 'big' },
              alignItems: 'center',
              parts: ['a', 'b'],
            },
            'c',
          ],
        },
        'd',
      ],
    });
  });
});

const prepareRegistry = () => PROSE_REGISTRY.setItems(blockMathRegistryItem);

describe('Block Math', () => {
  it('should create block math correctly', () => {
    isolateProse(() => {
      prepareRegistry();

      const blockMath = asEruditRaw(
        <BlockMath freeze>{`
          x + y = z >>{center} \\sin
        `}</BlockMath>,
      );

      expect(isRawElement(blockMath, blockMathSchema)).toBe(true);
      expect(blockMath.data).toStrictEqual({
        katex: 'x + y = z >>{center} \\sin',
        freeze: true,
      });
      expect(blockMath.storageKey).toBe('$$ x + y = z >>{center} \\sin $$');
    });
  });

  it('should throw when empty math expression is provided', () => {
    isolateProse(() => {
      prepareRegistry();
      expect(() => asEruditRaw(<BlockMath> </BlockMath>)).toThrow();
    });
  });
});
