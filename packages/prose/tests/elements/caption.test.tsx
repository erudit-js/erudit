import { describe, it, expect } from 'vitest';

import { Caption, captionName } from 'src/elements/caption/caption.global';
import { ElementType } from 'src/type';
import type { JsxElement } from 'src/element';
import type { CaptionSchema } from 'src/elements/caption/caption.global';
import {
    CaptionMain,
    captionMainName,
    type CaptionMainSchema,
} from 'src/elements/caption/main.global';
import {
    CaptionSecondary,
    captionSecondaryName,
    type CaptionSecondarySchema,
} from 'src/elements/caption/secondary.global';

describe('Caption', () => {
    describe('CaptionMain', () => {
        it('creates a main caption with children', () => {
            const main = (
                <CaptionMain>Main text</CaptionMain>
            ) as JsxElement<CaptionMainSchema>;
            expect(main.type).toBe(ElementType.Inliner);
            expect(main.name).toBe(captionMainName);
            expect(main.children).toHaveLength(1);
        });

        it('throws without children', () => {
            // @ts-expect-error empty children
            expect(() => <CaptionMain />).toThrow();
        });
    });

    describe('CaptionSecondary', () => {
        it('creates a secondary caption with children', () => {
            const secondary = (
                <CaptionSecondary>Secondary text</CaptionSecondary>
            ) as JsxElement<CaptionSecondarySchema>;
            expect(secondary.type).toBe(ElementType.Inliner);
            expect(secondary.name).toBe(captionSecondaryName);
            expect(secondary.children).toHaveLength(1);
        });

        it('throws without children', () => {
            // @ts-expect-error empty children
            expect(() => <CaptionSecondary />).toThrow();
        });
    });

    describe('Caption container', () => {
        it('creates caption with explicit main', () => {
            const cap = (
                <Caption width="50%">
                    <CaptionMain>Main part</CaptionMain>
                </Caption>
            ) as JsxElement<CaptionSchema>;
            expect(cap.type).toBe(ElementType.Block);
            expect(cap.name).toBe(captionName);
            expect(cap.children).toHaveLength(1);
            expect(cap.children[0].name).toBe(captionMainName);
            expect(cap.data?.width).toBe('50%');
        });

        it('creates caption with main and secondary', () => {
            const cap = (
                <Caption>
                    <CaptionMain>Main</CaptionMain>
                    <CaptionSecondary>Secondary</CaptionSecondary>
                </Caption>
            ) as JsxElement<CaptionSchema>;
            expect(cap.children).toHaveLength(2);
            expect(cap.children[0].name).toBe(captionMainName);
            expect(cap.children[1].name).toBe(captionSecondaryName);
        });

        it('wraps plain inline/text children into a main caption automatically', () => {
            const cap = (
                <Caption>Auto wrapped</Caption>
            ) as JsxElement<CaptionSchema>;
            expect(cap.children).toHaveLength(1);
            expect(cap.children[0].name).toBe(captionMainName);
        });
    });

    describe('Caption errors', () => {
        it('throws when secondary is present without main', () => {
            expect(() => (
                <Caption>
                    <CaptionSecondary>Secondary only</CaptionSecondary>
                </Caption>
            )).toThrow();
        });

        it('throws when first child is not main but a main exists later', () => {
            expect(() => (
                <Caption>
                    Intro text
                    <CaptionMain>Main later</CaptionMain>
                </Caption>
            )).toThrow();
        });

        it('throws when second child is not secondary', () => {
            expect(() => (
                <Caption>
                    <CaptionMain>Main</CaptionMain>
                    <CaptionMain>Another main</CaptionMain>
                </Caption>
            )).toThrow();
        });

        it('throws when more than two children are provided', () => {
            expect(() => (
                <Caption>
                    <CaptionMain>Main</CaptionMain>
                    <CaptionSecondary>Secondary</CaptionSecondary>
                    <CaptionSecondary>Extra</CaptionSecondary>
                </Caption>
            )).toThrow();
        });
    });
});
