import { describe, expect, it } from 'vitest';
import { defineDocument } from 'tsprose';

import { H1 } from '@src/elements/heading/core';
import { P } from '@src/elements/paragraph/core';
import { eruditRawToProse } from '@src/rawToProse';

describe('uniqueTitlesHook', () => {
  it('should collect unique titles correctly', async () => {
    const document = defineDocument({
      uniques: {
        myHeading: H1,
        pWithTitle: P,
        pWithoutTitle: P,
      },
    })(({ uniques }) => (
      <>
        <H1 $={uniques.myHeading}>Title</H1>
        <P $={uniques.pWithoutTitle}>First paragraph</P>
        <P $={uniques.pWithTitle} snippet={{ title: 'Custom title' }}>
          Second paragraph
        </P>
      </>
    ));

    const { uniqueTitles } = await eruditRawToProse({
      rawProse: document.rawProse,
    });

    expect(uniqueTitles).toEqual({
      myHeading: 'Title',
      pWithTitle: 'Custom title',
    });
  });
});
