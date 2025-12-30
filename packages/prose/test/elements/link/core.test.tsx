import { describe, expect, it } from 'vitest';
import {
    defineDocument,
    isolateProse,
    isProseElement,
    PROSE_REGISTRY,
} from '@jsprose/core';

import { asEruditRaw, resolveEruditRawElement } from '@erudit-js/prose';
import {
    Ref,
    refRegistryItem,
} from '@erudit-js/prose/elements/link/reference/core';
import {
    Dep,
    Dependency,
    depRegistryItem,
    depSchema,
    dependencyRegistryItem,
} from '@erudit-js/prose/elements/link/dependency/core';
import {
    P,
    paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import {
    stringifyDocumentId,
    type DocumentId,
} from '@erudit-js/core/prose/documentId';

describe('Reference Links', () => {
    it('should throw when unable to resolve "to" prop', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(refRegistryItem);
            expect(() =>
                asEruditRaw(<Ref to={123 as any}>Invalid Link</Ref>),
            ).toThrow();
        });
    });

    it('should throw when label is empty', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(refRegistryItem);
            expect(() => <Ref to="direct"> </Ref>).toThrow();
        });
    });

    it('should create stringified storage key', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(refRegistryItem);
            const link = asEruditRaw(
                <Ref to="https://example.com">Example</Ref>,
            );
            expect(link.storageKey).toBe('<link:direct>/https://example.com');
        });
    });
});

describe('Dependency Links', () => {
    it('should collect dependencies', async () => {
        await isolateProse(async () => {
            PROSE_REGISTRY.setItems(
                depRegistryItem,
                dependencyRegistryItem,
                paragraphRegistryItem,
            );

            const otherDocumentLink: DocumentId = {
                type: 'contentTopic',
                topicPart: 'article',
                contentId: 'topic-111/article-222',
            };

            const otherDocument = defineDocument(
                stringifyDocumentId(otherDocumentLink),
                {
                    uniques: {
                        externalP: P,
                    },
                },
            )(({ uniques }) => (
                <>
                    <P>Other Document Paragraph</P>
                    <P $={uniques.externalP}>External Unique Paragraph</P>
                </>
            ));

            const thisDocumentLink: DocumentId = {
                type: 'contentPage',
                contentId: 'topic-456/page-789',
            };

            const thisDocument = defineDocument(
                stringifyDocumentId(thisDocumentLink),
                {
                    uniques: {
                        internalP: P,
                    },
                },
            )(({ uniques }) => (
                <>
                    <P>Regular Paragraph</P>

                    <Dependency to={otherDocument.uniques.externalP}>
                        Dependency to External Unique
                    </Dependency>

                    <Dep to={uniques.internalP}>Dependency to Self Unique</Dep>

                    <Dep to={uniques.internalP}>
                        Dependency to internal paragraph
                    </Dep>
                    <P $={uniques.internalP}>Internal Paragraph</P>
                </>
            ));

            const { dependencies: links, proseElement } =
                await resolveEruditRawElement({
                    context: {
                        language: 'en',
                        linkable: true,
                    },
                    rawElement: thisDocument.content,
                });

            expect(links.size).toBe(2);
            expect(links).toEqual(
                new Set<string>([
                    // Link to unique
                    '<link:global>/topic-456/page-789/$internalP',

                    // Link to external unique
                    '<link:global>/topic-111/article-222/article/$externalP',
                ]),
            );
        });
    });

    it('should execute dependencyStep resolve step', async () => {
        await isolateProse(async () => {
            PROSE_REGISTRY.setItems(
                depRegistryItem,
                dependencyRegistryItem,
                paragraphRegistryItem,
            );

            const otherDocumentLink: DocumentId = {
                type: 'contentTopic',
                topicPart: 'article',
                contentId: 'topic-333/article-444',
            };

            const otherDocument = defineDocument(
                stringifyDocumentId(otherDocumentLink),
                {
                    uniques: {
                        externalP: P,
                    },
                },
            )(({ uniques }) => (
                <>
                    <P>Other Document Paragraph</P>
                    <P $={uniques.externalP}>External Unique Paragraph</P>
                </>
            ));

            const thisDocumentLink: DocumentId = {
                type: 'contentPage',
                contentId: 'topic-555/page-666',
            };

            const thisDocument = defineDocument(
                stringifyDocumentId(thisDocumentLink),
                {
                    uniques: {
                        internalP: P,
                    },
                },
            )(({ uniques }) => (
                <>
                    <P>Regular Paragraph</P>
                    <P>
                        This is a <Dep to={uniques.internalP}>dependency</Dep>!
                    </P>
                    <P $={uniques.internalP}>Internal Paragraph</P>
                </>
            ));

            const { proseElement, dependencies } =
                await resolveEruditRawElement({
                    context: {
                        language: 'en',
                        linkable: true,
                    },
                    rawElement: thisDocument.content,
                });

            const depElement = proseElement.children!.at(1)?.children!.at(1)!;
            expect(isProseElement(depElement, depSchema)).toBe(true);
            expect(depElement.storageKey).toBe(
                '<link:global>/topic-555/page-666/$internalP',
            );

            expect(dependencies.size).toBe(1);
            expect(dependencies).toEqual(
                new Set<string>([
                    '<link:global>/topic-555/page-666/$internalP',
                ]),
            );
        });
    });
});
