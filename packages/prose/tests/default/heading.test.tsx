import { describe, it, expect } from 'vitest';

import { type HeadingSchema } from 'src/default/heading';
import { ElementType } from 'src/type';
import type { JsxElement } from 'src/element';

describe('Heading', () => {
    describe('h1', () => {
        it('should create an h1 heading with proper data', () => {
            const heading = (
                <h1>Test Heading</h1>
            ) as JsxElement<HeadingSchema>;

            expect(heading.type).toBe(ElementType.Block);
            expect(heading.name).toBe('heading');
            expect(heading.data.level).toBe(1);
            expect(heading.data.title).toBe('Test Heading');
            expect(heading.children).toBeUndefined();
        });

        it('should create h1 with complex text content', () => {
            const heading = (
                <h1>Complex heading with 123 numbers and symbols!</h1>
            ) as JsxElement<HeadingSchema>;

            expect(heading.data.level).toBe(1);
            expect(heading.data.title).toBe(
                'Complex heading with 123 numbers and symbols!',
            );
        });
    });

    describe('h2', () => {
        it('should create an h2 heading with proper data', () => {
            const heading = (
                <h2>Secondary Heading</h2>
            ) as JsxElement<HeadingSchema>;

            expect(heading.type).toBe(ElementType.Block);
            expect(heading.name).toBe('heading');
            expect(heading.data.level).toBe(2);
            expect(heading.data.title).toBe('Secondary Heading');
            expect(heading.children).toBeUndefined();
        });
    });

    describe('h3', () => {
        it('should create an h3 heading with proper data', () => {
            const heading = (
                <h3>Tertiary Heading</h3>
            ) as JsxElement<HeadingSchema>;

            expect(heading.type).toBe(ElementType.Block);
            expect(heading.name).toBe('heading');
            expect(heading.data.level).toBe(3);
            expect(heading.data.title).toBe('Tertiary Heading');
            expect(heading.children).toBeUndefined();
        });
    });

    describe('Snippet Data', () => {
        it('should precreate snippet data with search=true and title', () => {
            const heading = (
                <h1>Snippet Heading</h1>
            ) as JsxElement<HeadingSchema>;

            expect(heading.snippet).toBeDefined();
            expect(heading.snippet!.search).toBe(true);
            expect(heading.snippet!.title).toBe('Snippet Heading');
        });

        it('should use $snippet.title prop if provided', () => {
            const heading = (
                <h2 $snippet={{ title: 'Custom Snippet Title' }}>
                    Actual Heading
                </h2>
            ) as JsxElement<HeadingSchema>;

            expect(heading.snippet).toBeDefined();
            expect(heading.snippet!.search).toBe(true);
            expect(heading.snippet!.title).toBe('Custom Snippet Title');
        });
    });

    describe('Error Validation', () => {
        it('should throw error when h1 has no children', () => {
            // @ts-expect-error Empty children
            expect(() => <h1></h1>).toThrow(
                '<h1> requires exactly one text child element!',
            );
        });

        it('should throw error when h2 has no children', () => {
            // @ts-expect-error Empty children
            expect(() => <h2></h2>).toThrow(
                '<h2> requires exactly one text child element!',
            );
        });

        it('should throw error when h3 has no children', () => {
            // @ts-expect-error Empty children
            expect(() => <h3></h3>).toThrow(
                '<h3> requires exactly one text child element!',
            );
        });

        it('should throw error when heading has non-text child', () => {
            expect(() => (
                // @ts-expect-error Non-text child
                <h1>
                    <p>Non-text child</p>
                </h1>
            )).toThrow(
                '<h1> requires exactly one text child element, but received <p>!',
            );
        });

        it('should throw error for different heading levels with invalid content', () => {
            expect(() => (
                // @ts-expect-error Non-text child
                <h2>
                    <span>Invalid span content</span>
                </h2>
            )).toThrow(
                '<h2> requires exactly one text child element, but received <span>!',
            );

            // @ts-expect-error Multiple text children
            expect(() => <h3>{['Text 1', 'Text 2', 'Text 3']}</h3>).toThrow(
                '<h3> requires exactly one text child element, but received 3 children: <text>, <text>, <text>!',
            );
        });
    });
});
