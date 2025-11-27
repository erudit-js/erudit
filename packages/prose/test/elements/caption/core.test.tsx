import { describe, expect, it } from 'vitest';
import {
    isolateProse,
    isRawElement,
    PROSE_REGISTRY,
    textSchema,
} from '@jsprose/core';

import {
    P,
    paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import { asEruditRaw } from '@erudit-js/prose';
import {
    Caption,
    CaptionSecondary,
    captionRegistryItem,
    captionSecondaryRegistryItem,
    captionSecondarySchema,
} from '@erudit-js/prose/elements/caption/core';

const prepareRegistry = () =>
    PROSE_REGISTRY.setItems(
        paragraphRegistryItem,
        captionSecondaryRegistryItem,
        captionRegistryItem,
    );

describe('Caption', () => {
    it('should create correctly create caption with only main', () => {
        isolateProse(() => {
            prepareRegistry();

            const caption = asEruditRaw(
                <Caption width="200px">Main caption</Caption>,
            );

            expect(caption.data).toStrictEqual({ width: '200px' });
            expect(caption.children).toHaveLength(1);
            expect(isRawElement(caption.children![0], textSchema)).toBe(true);
        });
    });

    it('should correctly create caption with main and secondary', () => {
        isolateProse(() => {
            prepareRegistry();

            const caption = asEruditRaw(
                <Caption>
                    Main caption
                    <CaptionSecondary>Secondary caption</CaptionSecondary>
                </Caption>,
            );

            expect(caption.data).toBeUndefined();
            expect(caption.children).toHaveLength(2);
            expect(isRawElement(caption.children![0], textSchema)).toBe(true);
            expect(
                isRawElement(caption.children![1], captionSecondarySchema),
            ).toBe(true);
        });
    });

    it('should throw when wrong children are provided', () => {
        isolateProse(() => {
            prepareRegistry();

            // Block instead of inliner
            expect(() => (
                <Caption>
                    <P>Wrong paragraph</P>
                </Caption>
            )).toThrow();

            // Secondary without main
            expect(() => (
                <Caption>
                    <CaptionSecondary>Secondary without main</CaptionSecondary>
                </Caption>
            )).toThrow(/without a main caption/);

            // More than two secondary children
            expect(() => (
                <Caption>
                    Main content
                    <CaptionSecondary>Secondary 1</CaptionSecondary>
                    <CaptionSecondary>Secondary 2</CaptionSecondary>
                </Caption>
            )).toThrow(/Duplicate/);
        });
    });
});
