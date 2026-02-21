import { describe, expect, it } from 'vitest';

import mathGlobal from '@src/elements/math/_global';

describe('math', () => {
  const { math } = mathGlobal;

  it('should do not touch back slashes in math expressions', () => {
    expect(math`a \cdot b`).toBe('a \\cdot b');
  });
});
