import { describe, expect, it } from 'vitest';

import { B, I, type EmphasisSchema } from '@src/elements/emphasis/core';
import { asEruditRaw } from '@src/rawElement';

describe('Emphasis', () => {
  it('should correctly set type of emphasis', () => {
    expect(asEruditRaw<EmphasisSchema>(<B>Bold Text</B>).data).toEqual({
      type: 'bold',
    });
    expect(
      asEruditRaw<EmphasisSchema>(<B accent={true}>Bold Accent Text</B>).data,
    ).toEqual({
      type: 'bold',
      accent: true,
    });
    expect(asEruditRaw<EmphasisSchema>(<I>Italic Text</I>).data).toEqual({
      type: 'italic',
    });
  });

  it('should correctly handle emphasis inside another emphasis', () => {
    const boldItalic = asEruditRaw<EmphasisSchema>(
      <B>
        <I>Bold and Italic</I>
      </B>,
    );

    expect(boldItalic.data).toEqual({ type: 'bold' });
    expect(boldItalic.children).toHaveLength(1);

    const italicChild = boldItalic.children![0];
    expect(italicChild.data).toEqual({ type: 'italic' });
    expect(italicChild.children).toHaveLength(1);

    const textChild = italicChild.children![0];
    expect(textChild.data).toBe('Bold and Italic');
  });
});
