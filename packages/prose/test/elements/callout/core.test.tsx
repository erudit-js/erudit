import { isRawElement, PROSE_REGISTRY } from '@jsprose/core';
import { describe, expect, it } from 'vitest';

import { asEruditRaw } from '@erudit-js/prose';
import {
  P,
  paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import {
  Callout,
  calloutRegistryItem,
  calloutSchema,
} from '@erudit-js/prose/elements/callout/core';

const prepareRegistry = () =>
  PROSE_REGISTRY.setItems(calloutRegistryItem, paragraphRegistryItem);

describe('Callout', () => {
  it('should create callout correctly', () => {
    prepareRegistry();

    const callout = asEruditRaw(
      <Callout icon="icon.png" invert="dark" title="Note Title">
        <P>Paragraph</P>
      </Callout>,
    );

    expect(isRawElement(callout, calloutSchema)).toBe(true);
    expect(callout.data).toStrictEqual({
      iconSrc: 'icon.png',
      iconInvert: 'dark',
      title: 'Note Title',
    });
    expect(callout.storageKey).toBe('icon.png');
    expect(callout.children).toHaveLength(1);
    expect(
      isRawElement(callout.children![0], paragraphRegistryItem.schema),
    ).toBe(true);
  });
});
