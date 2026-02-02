import { describe, expect, it } from 'vitest';
import { defineUnique, isolateProse, PROSE_REGISTRY } from '@jsprose/core';

import { asEruditRaw } from '@erudit-js/prose';
import {
  Details,
  detailsRegistryItem,
} from '@erudit-js/prose/elements/details/core';
import {
  P,
  paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';

describe('Details', () => {
  it('should throw if no unique is attached', () => {
    isolateProse(() => {
      PROSE_REGISTRY.setItems(detailsRegistryItem);
      // @ts-expect-error
      expect(() => <Details> </Details>).toThrow();
    });
  });

  it('should correctly set children and optional title', () => {
    isolateProse(() => {
      PROSE_REGISTRY.setItems(detailsRegistryItem, paragraphRegistryItem);

      const noTitleUnique = defineUnique({
        documentId: 'details-test',
        name: 'detailsNoTitle',
        tag: Details,
      });

      const detailsNoTitle = asEruditRaw(
        <Details $={noTitleUnique}>
          <P>This is some hidden content.</P>
          <P>This is some more hidden content.</P>
        </Details>,
      );

      expect(detailsNoTitle.data).toBeUndefined();
      expect(detailsNoTitle.children!.length).toBe(2);
      expect(detailsNoTitle.slug).toBeUndefined();
      expect(detailsNoTitle.children![0].schemaName).toBe('paragraph');
      expect(detailsNoTitle.children![1].schemaName).toBe('paragraph');

      const withTitleUnique = defineUnique({
        documentId: 'details-test',
        name: 'detailsWithTitle',
        tag: Details,
      });

      const detailsWithTitle = asEruditRaw(
        <Details $={withTitleUnique} title="More Info">
          {' '}
        </Details>,
      );

      expect(detailsWithTitle.data.title).toBe('More Info');
      expect(detailsWithTitle.slug).toBe('More Info');
      expect(detailsWithTitle.title).toBe('More Info');
    });
  });
});
