import { describe, it, expect } from 'vitest';

import { Paragraph } from 'src/default/paragraph';
import { defineUnique } from 'src/unique';

describe('defineUnique', () => {
    it('should throw on assign tag mismatch', () => {
        const myP = defineUnique({
            tag: Paragraph,
            slug: 'myP',
            url: '<test-url>',
        });

        // @ts-expect-error Assigning span to paragraph unique
        expect(() => <h1 $={myP}>My h1, not paragraph!</h1>).toThrow(
            'Element unique "myP" can only be assigned to <p>, but was assigned to <h1>!',
        );
    });
});
