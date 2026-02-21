import { describe, it, expect } from 'vitest';

import { P } from '@src/elements/paragraph/core';

describe('Paragraph', () => {
  it('should have empty data if no props are provided', () => {
    expect((<P>No props content</P>).data).toBeUndefined();
  });

  it('should correctly set data', () => {
    expect((<P center>Centered content</P>).data).toEqual({
      center: true,
    });
    expect((<P serif>Serif content</P>).data).toEqual({
      serif: true,
    });
    expect(
      (
        <P center serif>
          Centered and serif content
        </P>
      ).data,
    ).toEqual({ center: true, serif: true });
  });
});
