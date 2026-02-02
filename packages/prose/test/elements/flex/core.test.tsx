import { describe, expect, it } from 'vitest';
import { isolateProse, PROSE_REGISTRY } from '@jsprose/core';

import { Flex, flexRegistryItem } from '@erudit-js/prose/elements/flex/core';
import {
  B,
  emphasisRegistryItem,
} from '@erudit-js/prose/elements/emphasis/core';
import {
  P,
  paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import { asEruditRaw } from '@erudit-js/prose';

describe('Flex', () => {
  it('should throw is passed inliners as children', () => {
    isolateProse(() => {
      PROSE_REGISTRY.setItems(flexRegistryItem, emphasisRegistryItem);

      expect(() => {
        <Flex>
          <B>Bold inside flex</B>
        </Flex>;
      }).toThrow();
    });
  });

  it('should correctly set gap, justifyContent and children', () => {
    isolateProse(() => {
      PROSE_REGISTRY.setItems(flexRegistryItem, paragraphRegistryItem);
      const flexElement = asEruditRaw(
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
});
