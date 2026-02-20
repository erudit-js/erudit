import { describe, expect, it } from 'vitest';
import { isRawElement } from 'tsprose';

import { asEruditRaw } from '@src/rawElement';
import core, {
  Callout,
  calloutSchema,
  type CalloutSchema,
} from '@src/elements/callout/core';
import { P } from '@src/elements/paragraph/core';
import { eruditRawToProse } from '@src/rawToProse';

describe('Callout', () => {
  it('should create callout correctly', () => {
    const callout = asEruditRaw<CalloutSchema>(
      <Callout icon="icon.png" invert="dark" title="Note Title">
        <P>Paragraph</P>
      </Callout>,
    );

    expect(isRawElement(callout, calloutSchema)).toBe(true);
    expect(callout.data).toEqual({
      iconSrc: 'icon.png',
      iconInvert: 'dark',
      title: 'Note Title',
    });
    expect(callout.storageKey).toBe('icon.png');
    expect(callout.children).toHaveLength(1);
    expect(isRawElement(callout.children![0], P.schema)).toBe(true);
  });

  it('should wrap inliners in paragraph', () => {
    const callout = asEruditRaw<CalloutSchema>(
      <Callout icon="icon.png" title="Note Title">
        Text without paragraph
      </Callout>,
    );

    expect(isRawElement(callout, calloutSchema)).toBe(true);
    expect(isRawElement(callout.children[0], P.schema)).toBe(true);
  });
});

describe('rawToProseHook', () => {
  it('should add icon svg to files', async () => {
    const { files } = await eruditRawToProse({
      rawProse: (
        <>
          <Callout icon="icon.png" title="Note Title">
            <P>Paragraph</P>
          </Callout>
        </>
      ),
      schemaHooks: new Map([[calloutSchema, core.rawToProseHook]]),
    });

    expect(files.has('icon.png')).toBe(true);
  });
});
