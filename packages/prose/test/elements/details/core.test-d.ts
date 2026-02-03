import { describe, it } from 'vitest';

import { Details } from '@erudit-js/prose/elements/details/core';

describe('Details', () => {
  it('should require unique tag prop', () => {
    // @ts-expect-error
    Details({ children: undefined as any });
  });

  it('should not let use toc and snippet tag props', () => {
    // @ts-expect-error
    Details({ toc: true });
    // @ts-expect-error
    Details({ snippet: { title: 'something' } });
  });
});
