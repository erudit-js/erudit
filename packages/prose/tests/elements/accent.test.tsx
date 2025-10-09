import { describe, it, expect } from 'vitest';

import { defineAccentSchema } from 'src/elements/accent/schema';
import { defineAccentGlobal } from 'src/elements/accent/globalDefinition';
import { ElementType } from 'src/type';
import type { JsxElement } from 'src/element';

// Helper to setup accent tags quickly
function setup() {
    const schema = defineAccentSchema('Accent')('Info', 'Warning');
    const [blockGlobal, sectionGlobal] = defineAccentGlobal(schema);
    return {
        schema,
        Accent: blockGlobal.tags.Accent,
        AccentMain: sectionGlobal.tags.AccentMain,
        AccentSection: sectionGlobal.tags.AccentSection,
        AccentInfo: sectionGlobal.tags.AccentInfo,
        AccentWarning: sectionGlobal.tags.AccentWarning,
    } as const;
}

describe('Accent', () => {
    describe('Valid constructions', () => {
        it('creates block with required main section and custom section', () => {
            const { Accent, AccentMain, AccentSection } = setup();
            const el = (
                <Accent title="Example">
                    <AccentMain>
                        <p>Main content</p>
                    </AccentMain>
                    <AccentSection title="Details">
                        <p>Detail content</p>
                    </AccentSection>
                </Accent>
            ) as JsxElement<any>;

            expect(el.type).toBe(ElementType.Block);
            expect(el.name).toBe('Accent');
            expect(el.data.title).toBe('Example');
            expect(el.data.direction).toBe('column');
            expect(el.children!.length).toBe(2);
            const [main, custom] = el.children!;
            expect(main.data.type).toBe('main');
            expect(custom.data.type).toBe('custom');
            expect(custom.data.title).toBe('Details');
        });

        it('creates suffix section variants', () => {
            const { Accent, AccentMain, AccentInfo, AccentWarning } = setup();
            const el = (
                <Accent title="Example" direction="row">
                    <AccentMain>
                        <p>Main content</p>
                    </AccentMain>
                    <AccentInfo>
                        <p>Info content</p>
                    </AccentInfo>
                    <AccentWarning>
                        <p>Warn content</p>
                    </AccentWarning>
                </Accent>
            ) as JsxElement<any>;

            expect(el.data.direction).toBe('row');
            expect(el.children!.length).toBe(3);
            const [, info, warn] = el.children!;
            expect(info.data.type).toBe('suffix');
            expect(info.data.suffix).toBe('Info');
            expect(warn.data.type).toBe('suffix');
            expect(warn.data.suffix).toBe('Warning');
        });
    });

    describe('Error validation', () => {
        it('throws if schema uses reserved suffix', () => {
            expect(() => defineAccentSchema('Bad')('Main')).toThrow();
            expect(() => defineAccentSchema('Bad')('Section')).toThrow();
        });

        it('throws if section (custom) missing title prop', () => {
            const { Accent, AccentMain, AccentSection } = setup();
            expect(() => (
                <Accent title="X">
                    <AccentMain>
                        <p>Main</p>
                    </AccentMain>
                    {/*  @ts-expect-error Missing required title prop intentionally */}
                    <AccentSection>
                        <p>No title</p>
                    </AccentSection>
                </Accent>
            )).toThrow();
        });

        it('throws if block missing main section', () => {
            const { Accent, AccentSection } = setup();
            expect(() => (
                <Accent title="Example">
                    <AccentSection title="Details">
                        <p>Content</p>
                    </AccentSection>
                </Accent>
            )).toThrow();
        });

        it('throws if block has non-section child', () => {
            const { Accent, AccentMain } = setup();
            expect(() => (
                <Accent title="Example">
                    <AccentMain>
                        <p>Main</p>
                    </AccentMain>
                    {/* Invalid non-section child */}
                    <p>Invalid</p>
                </Accent>
            )).toThrow();
        });
    });
});
