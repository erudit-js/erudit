import { describe, it } from 'vitest';

import { Details } from '@src/elements/details/core';

describe('Details', () => {
  it('should require unique tag prop', () => {
    // @ts-expect-error
    Details({ children: undefined as any });
  });

  it('should not let use toc and snippet tag props', () => {
    Details({
      $: {} as any,
      // @ts-expect-error
      toc: true,
    });

    Details({
      $: {} as any,
      // @ts-expect-error
      snippet: { title: 'something' },
    });
  });
});
