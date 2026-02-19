import { describe, expect, it } from 'vitest';
import { defineUnique, isRawElement } from 'tsprose';

import { Details, type DetailsSchema } from '@src/elements/details/core';
import { asEruditRaw } from '@src/rawElement';
import { P } from '@src/elements/paragraph/core';

describe('Details', () => {
  it('should throw if no unique is attached', () => {
    // @ts-expect-error
    expect(() => <Details> </Details>).toThrow();
  });

  it('should correctly set children and optional title', () => {
    const noTitleUnique = defineUnique({
      documentId: 'details-test',
      name: 'detailsNoTitle',
      tag: Details,
    });

    const detailsNoTitle = asEruditRaw<DetailsSchema>(
      <Details $={noTitleUnique}>
        <P>This is some hidden content.</P>
        <P>This is some more hidden content.</P>
      </Details>,
    );

    expect(detailsNoTitle.data).toBeUndefined();
    expect(detailsNoTitle.children!.length).toBe(2);
    expect(detailsNoTitle.slug).toBeUndefined();
    expect(isRawElement(detailsNoTitle.children![0], P.schema)).toBe(true);
    expect(isRawElement(detailsNoTitle.children![1], P.schema)).toBe(true);

    const withTitleUnique = defineUnique({
      documentId: 'details-test',
      name: 'detailsWithTitle',
      tag: Details,
    });

    const detailsWithTitle = asEruditRaw<DetailsSchema>(
      <Details $={withTitleUnique} title="More Info">
        {' '}
      </Details>,
    );

    expect(detailsWithTitle.data.title).toBe('More Info');
    expect(detailsWithTitle.slug).toBe('More Info');
    expect(detailsWithTitle.title).toBe('More Info');
  });

  it('should wrap inliners in paragraph', () => {
    const unique = defineUnique({
      documentId: 'details-test',
      name: 'detailsWithInliners',
      tag: Details,
    });

    const detailsWithInliners = asEruditRaw<DetailsSchema>(
      <Details $={unique}>
        This is some hidden pure text content that should be wrapped in a
        paragraph.
      </Details>,
    );

    expect(isRawElement(detailsWithInliners.children![0], P.schema)).toBe(true);
  });
});
