import { describe, it, expect } from 'vitest';
import { isolateProse, PROSE_REGISTRY } from '@jsprose/core';

import {
  P,
  paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';

describe('Paragraph', () => {
  it('should have empty data if no props are provided', () => {
    isolateProse(() => {
      PROSE_REGISTRY.setItems(paragraphRegistryItem);
      expect((<P>No props content</P>).data).toBeUndefined();
    });
  });

  it('should correctly set data', () => {
    isolateProse(() => {
      PROSE_REGISTRY.setItems(paragraphRegistryItem);

      expect((<P center>Centered content</P>).data).toStrictEqual({
        center: true,
      });
      expect((<P serif>Serif content</P>).data).toStrictEqual({
        serif: true,
      });
      expect(
        (
          <P center serif>
            Centered and serif content
          </P>
        ).data,
      ).toStrictEqual({ center: true, serif: true });
    });
  });
});
