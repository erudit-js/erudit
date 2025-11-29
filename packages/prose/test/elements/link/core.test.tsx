import { describe, expect, it } from 'vitest';
import {
    defineDocument,
    isolateProse,
    PROSE_REGISTRY,
    uniqueName2Id,
} from '@jsprose/core';
import { stringifyProseLink } from '@erudit-js/core/prose/link';

import { asEruditRaw, resolveEruditRawElement } from '@erudit-js/prose';
import {
    A,
    BlockLink,
    blockLinkRegistryItem,
    linkRegistryItem,
} from '@erudit-js/prose/elements/link/core';
import {
    P,
    paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import {
    stringifyDocumentId,
    type DocumentId,
} from '@erudit-js/core/prose/documentId';

describe('Link', () => {
    it('should throw when unable to resolve "to" prop', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(linkRegistryItem);
            expect(() =>
                asEruditRaw(<A to={123 as any}>Invalid Link</A>),
            ).toThrow();
        });
    });

    it('should throw when label is empty', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(linkRegistryItem);
            expect(() => <A to="direct"> </A>).toThrow();
        });
    });

    it('should create stringified storage key', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(linkRegistryItem);
            const link = asEruditRaw(<A to="https://example.com">Example</A>);
            expect(link.storageKey).toBe(
                stringifyProseLink({
                    type: 'direct',
                    href: 'https://example.com',
                }),
            );
        });
    });
});

describe('linkStep', () => {
    it('should collect links', async () => {
        await isolateProse(async () => {
            PROSE_REGISTRY.setItems(
                linkRegistryItem,
                blockLinkRegistryItem,
                paragraphRegistryItem,
            );

            const otherDocumentLink: DocumentId = {
                type: 'contentTopic',
                topicPart: 'article',
                contentId: 'topic-999/article-888',
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
                contentId: 'topic-123/page-456',
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

                    <A to="https://example.com">Direct Link</A>

                    <A to={otherDocument}>Document Link</A>
                    <BlockLink to={otherDocument.uniques.externalP}>
                        Link to External Unique
                    </BlockLink>

                    <A to={uniques.internalP}>Link to Self Unique</A>

                    <A to={uniques.internalP}>Link to internal paragraph</A>
                    <P $={uniques.internalP}>Internal Paragraph</P>
                </>
            ));

            const { links, proseElement } = await resolveEruditRawElement({
                context: {
                    language: 'en',
                    linkable: true,
                },
                rawElement: thisDocument.content,
            });

            expect(links.size).toBe(4);
            expect(links).toEqual(
                new Set<string>([
                    // Direct link
                    stringifyProseLink({
                        type: 'direct',
                        href: 'https://example.com',
                    }),

                    // Link to document
                    stringifyProseLink({
                        type: 'document',
                        documentId: otherDocumentLink,
                    }),

                    // Link to unique
                    stringifyProseLink({
                        type: 'unique',
                        documentId: otherDocumentLink,
                        uniqueId: uniqueName2Id('externalP'),
                    }),

                    // Link to self unique
                    stringifyProseLink({
                        type: 'unique',
                        documentId: thisDocumentLink,
                        uniqueId: uniqueName2Id('internalP'),
                    }),
                ]),
            );
        });
    });
});
