import { describe, expect, it } from 'vitest';

import { Flex, type FlexSchema } from '@src/elements/flex/core';
import { B } from '@src/elements/emphasis/core';
import { asEruditRaw } from '@src/rawElement';
import { P } from '@src/elements/paragraph/core';

describe('Flex', () => {
  it('should throw with inliner children', () => {
    expect(() => {
      <Flex>
        <B>Bold inside flex</B>
      </Flex>;
    }).toThrow();
  });

  it('should correctly set gap, justifyContent and children', () => {
    const flexElement = asEruditRaw<FlexSchema>(
      <Flex gap="10px" justify="space-between">
        <P>Paragraph</P>
      </Flex>,
    );
    expect(flexElement.children).toHaveLength(1);
    expect(flexElement.data).toStrictEqual({
      gap: '10px',
      justifyContent: 'space-between',
    });
  });
});
