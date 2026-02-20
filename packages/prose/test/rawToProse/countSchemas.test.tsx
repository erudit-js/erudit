import { describe, expect, it } from 'vitest';

import { B } from '@src/elements/emphasis/core';
import { Image } from '@src/elements/image/core';
import { P } from '@src/elements/paragraph/core';
import { eruditRawToProse } from '@src/rawToProse';
import { Include } from '@src/include';

describe('countSchemasHook', () => {
  const externalParagraph = <P>External paragraph</P>;

  it('should count schemas correctly', async () => {
    const { schemaCounts } = await eruditRawToProse({
      rawProse: (
        <>
          <P>
            Hello <B>World</B>!
          </P>
          <Image src="image.jpg" />
          <Include>{externalParagraph}</Include>
        </>
      ),
    });

    expect(schemaCounts).toEqual({
      mix: 1,
      paragraph: 1,
      text: 3,
      emphasis: 1,
      image: 1,
    });
  });
});
