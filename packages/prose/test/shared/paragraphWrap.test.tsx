import { describe, expect, it } from 'vitest';

import { paragraphWrap } from '@src/shared/paragraphWrap';
import { P } from '@src/elements/paragraph/core';

describe('paragraphWrap', () => {
  it('should return undefined when children is undefined', () => {
    expect(paragraphWrap(undefined)).toBeUndefined();
  });

  it('should return an array with a single paragraph element when children is valid', () => {
    expect(paragraphWrap((<>Hello {5} World</>).children)).toEqual([
      <P>Hello {5} World</P>,
    ]);
  });

  it('should return undefined when children is not valid for a paragraph', () => {
    expect(
      paragraphWrap(
        (
          <>
            Hello <P>World</P>
          </>
        ).children,
      ),
    ).toBeUndefined();
  });
});
