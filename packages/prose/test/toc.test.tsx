import { describe, expect, it } from 'vitest';
import { isolateProse, PROSE_REGISTRY } from '@jsprose/core';

import {
    finalizeToc,
    resolveEruditRawElement,
    type ResolvedTocItem,
} from '@erudit-js/prose';
import {
    P,
    paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import {
    H1,
    headingRegistryItem,
} from '@erudit-js/prose/elements/heading/core';
import {
    B,
    emphasisRegistryItem,
} from '@erudit-js/prose/elements/emphasis/core';

type DeepPartial<T> = T extends object
    ? {
          [P in keyof T]?: DeepPartial<T[P]>;
      }
    : T;

const testFinalizeToc = finalizeToc as (
    args: DeepPartial<Parameters<typeof finalizeToc>[0]>,
) => any;

describe('finalizeToc', () => {
    it('should repsect manually set TOC via tag props', () => {
        expect(
            testFinalizeToc({
                props: { toc: false },
                element: {
                    toc: {
                        title: 'Element Title',
                        add: true,
                    },
                },
            }),
        ).toBeUndefined();

        expect(
            testFinalizeToc({
                props: { toc: true },
                element: {
                    toc: {
                        title: 'Element Title',
                        add: false,
                    },
                },
            }),
        ).toStrictEqual({
            title: 'Element Title',
        });

        expect(
            testFinalizeToc({
                props: { toc: 'Manual Title' },
                element: {
                    toc: {
                        title: 'Element Title',
                        add: true,
                    },
                },
            }),
        ).toStrictEqual({
            title: 'Manual Title',
        });
    });

    it('should fallback to internal TOC if manually set TOC title string is empty', () => {
        expect(
            testFinalizeToc({
                props: { toc: '   ' },
                element: {
                    toc: {
                        title: 'Element Title',
                        add: true,
                    },
                },
            }),
        ).toStrictEqual({
            title: 'Element Title',
        });
    });

    it('should fallback to element title when no other way to get TOC title', () => {
        expect(
            testFinalizeToc({
                props: { toc: true },
                element: {
                    title: 'Element Title',
                },
            }),
        ).toStrictEqual({
            title: 'Element Title',
        });
    });

    it('should throw when TOC title is not available but TOC flag is manually true', () => {
        expect(() =>
            testFinalizeToc({
                props: { toc: true },
                element: {},
            }),
        ).toThrow();
    });

    it('should handle implicit TOC addition from element', () => {
        expect(
            testFinalizeToc({
                props: {},
                element: {
                    toc: {
                        title: 'Element Title',
                        add: true,
                    },
                },
            }),
        ).toStrictEqual({
            title: 'Element Title',
        });
    });
});

describe('tocStep', () => {
    it('should collect TOC items in hierarchical structure', async () => {
        await isolateProse(async () => {
            PROSE_REGISTRY.setItems(
                paragraphRegistryItem,
                headingRegistryItem,
                emphasisRegistryItem,
            );

            const { tocItems, proseElement } = await resolveEruditRawElement({
                context: {
                    language: 'en',
                    linkable: true,
                },
                rawElement: (
                    <>
                        <H1>Heading 1 Title</H1>
                        <P>Some paragraph text.</P>
                        <P toc="P Toc Title">
                            Paragraph <B toc="Bold Too">in</B> Toc
                        </P>
                        <P
                            snippet={{ title: 'P Snippet Title' }}
                            quick
                            toc={true}
                        >
                            Paragraph in Toc too
                        </P>
                    </>
                ),
            });

            expect(tocItems).toHaveLength(1);
            expect(tocItems).toEqual<ResolvedTocItem[]>([
                {
                    type: 'heading',
                    level: 1,
                    title: 'Heading 1 Title',
                    elementId: proseElement.children![0].id!,
                    children: [
                        {
                            type: 'element',
                            schemaName: 'emphasis',
                            title: 'Bold Too',
                            elementId:
                                proseElement.children![2].children![1].id!,
                        },
                        {
                            type: 'element',
                            schemaName: 'paragraph',
                            title: 'P Toc Title',
                            elementId: proseElement.children![2].id!,
                        },
                        {
                            type: 'element',
                            schemaName: 'paragraph',
                            title: 'P Snippet Title',
                            elementId: proseElement.children![3].id!,
                        },
                    ],
                },
            ]);
        });
    });
});
