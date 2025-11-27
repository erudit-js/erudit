import { describe, expect, it } from 'vitest';
import { isolateProse, PROSE_REGISTRY } from '@jsprose/core';

import { asEruditRaw } from '@erudit-js/prose';
import {
    B,
    I,
    emphasisRegistryItem,
} from '@erudit-js/prose/elements/emphasis/core';

describe('Emphasis', () => {
    it('should correctly set type of emphasis', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(emphasisRegistryItem);
            expect(asEruditRaw(<B>Bold Text</B>).data).toStrictEqual({
                type: 'bold',
            });
            expect(asEruditRaw(<I>Italic Text</I>).data).toStrictEqual({
                type: 'italic',
            });
        });
    });

    it('should correctly handle emphasis inside another emphasis', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(emphasisRegistryItem);

            const boldItalic = asEruditRaw(
                <B>
                    <I>Bold and Italic</I>
                </B>,
            );

            expect(boldItalic.data).toStrictEqual({ type: 'bold' });
            expect(boldItalic.children).toHaveLength(1);

            const italicChild = boldItalic.children![0];
            expect(italicChild.data).toStrictEqual({ type: 'italic' });
            expect(italicChild.children).toHaveLength(1);

            const textChild = italicChild.children![0];
            expect(textChild.data).toBe('Bold and Italic');
        });
    });
});
