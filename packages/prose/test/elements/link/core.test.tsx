import { describe, expect, it } from 'vitest';
import {
    defineDocument,
    isolateProse,
    PROSE_REGISTRY,
    uniqueName2Id,
} from '@jsprose/core';
import {
    stringifyProseLink,
    TopicPart,
    type ContentDocumentProseLink,
    type ProseLink,
} from '@erudit-js/cog/schema';

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

describe('Link', () => {
    it('should correctly handle direct link', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(linkRegistryItem);

            const directLink = asEruditRaw(
                <A to="https://example.com">Example</A>,
            );

            expect(directLink.data).toStrictEqual({ label: 'Example' });
            expect(directLink.storageKey).toBe(
                stringifyProseLink({
                    type: 'direct',
                    href: 'https://example.com',
                }),
            );
        });
    });

    it('should correctly handle document link', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(linkRegistryItem);

            const link: ProseLink = {
                type: 'contentDocument',
                contentType: TopicPart.Article,
                fullContentId: 'topic-123/article-456',
            };

            const targetDocument = defineDocument(
                stringifyProseLink(link),
                {},
            )(() => <>Document content</>);

            const documentLink = asEruditRaw(
                <A to={targetDocument}>Document Link</A>,
            );

            expect(documentLink.data).toStrictEqual({ label: 'Document Link' });
            expect(documentLink.storageKey).toBe(stringifyProseLink(link));
        });
    });

    it('should correctly handle unique link', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(linkRegistryItem, paragraphRegistryItem);

            const link: ProseLink = {
                type: 'contentDocument',
                contentType: TopicPart.Summary,
                fullContentId: 'topic-123/summary-456',
            };

            const targetDocument = defineDocument(stringifyProseLink(link), {
                uniques: {
                    pUnique: P,
                },
            })(({ uniques }) => (
                <>
                    <P $={uniques.pUnique}>Unique Paragraph</P>
                </>
            ));

            const uniqueLink = asEruditRaw(
                <A to={targetDocument.uniques.pUnique}>Unique Link</A>,
            );

            expect(uniqueLink.data).toStrictEqual({ label: 'Unique Link' });
            expect(uniqueLink.storageKey).toBe(
                stringifyProseLink({
                    type: 'contentElement',
                    isUnique: true,
                    contentType: TopicPart.Summary,
                    fullContentId: 'topic-123/summary-456',
                    elementId: uniqueName2Id('pUnique'),
                }),
            );
        });
    });

    it('should throw when target non-content document', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(linkRegistryItem);

            const link: ProseLink = {
                type: 'direct',
                href: 'https://example.com',
            };

            const targetDocument = defineDocument(
                stringifyProseLink(link),
                {},
            )(() => <>Document content</>);

            expect(() => (
                <A to={targetDocument}>Invalid Document Link</A>
            )).toThrow();
        });
    });

    it('should throw when target unique is not in content document', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(linkRegistryItem, paragraphRegistryItem);

            const link: ProseLink = {
                type: 'direct',
                href: 'https://example.com',
            };

            const targetDocument = defineDocument(stringifyProseLink(link), {
                uniques: {
                    pUnique: P,
                },
            })(({ uniques }) => (
                <>
                    <P $={uniques.pUnique}>Unique Paragraph</P>
                </>
            ));

            expect(() => (
                <A to={targetDocument.uniques.pUnique}>Invalied Unique link</A>
            )).toThrow();
        });
    });

    it('should throw when label is empty', () => {
        isolateProse(() => {
            PROSE_REGISTRY.setItems(linkRegistryItem);
            expect(() => <A to="direct"> </A>).toThrow();
        });
    });
});

describe('linkStep', () => {
    it('should collet links', async () => {
        await isolateProse(async () => {
            PROSE_REGISTRY.setItems(
                linkRegistryItem,
                blockLinkRegistryItem,
                paragraphRegistryItem,
            );

            const otherDocumentLink: ContentDocumentProseLink = {
                type: 'contentDocument',
                contentType: TopicPart.Article,
                fullContentId: 'topic-999/article-888',
            };

            const otherDocument = defineDocument(
                stringifyProseLink(otherDocumentLink),
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

            const thisDocumentLink: ContentDocumentProseLink = {
                type: 'contentDocument',
                contentType: TopicPart.Article,
                fullContentId: 'topic-123/article-456',
            };

            const thisDocument = defineDocument(
                stringifyProseLink(thisDocumentLink),
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

            expect(Object.keys(links)).toHaveLength(5);
            expect(links).toStrictEqual({
                // Direct link
                [String(proseElement.children?.[1]?.id)]: stringifyProseLink({
                    type: 'direct',
                    href: 'https://example.com',
                }),
                // Link to document
                [String(proseElement.children?.[2]?.id)]:
                    stringifyProseLink(otherDocumentLink),
                // Link to unique
                [String(proseElement.children?.[3]?.id)]: stringifyProseLink({
                    type: 'contentElement',
                    isUnique: true,
                    contentType: otherDocumentLink.contentType,
                    fullContentId: otherDocumentLink.fullContentId,
                    elementId: uniqueName2Id('externalP'),
                }),
                // Link to self unique
                [String(proseElement.children?.[4]?.id)]: stringifyProseLink({
                    type: 'contentElement',
                    isUnique: true,
                    contentType: thisDocumentLink.contentType,
                    fullContentId: thisDocumentLink.fullContentId,
                    elementId: uniqueName2Id('internalP'),
                }),
                // Link to internal paragraph
                [String(proseElement.children?.[5]?.id)]: stringifyProseLink({
                    type: 'contentElement',
                    isUnique: true,
                    contentType: thisDocumentLink.contentType,
                    fullContentId: thisDocumentLink.fullContentId,
                    elementId: String(proseElement.children?.[6]?.id),
                }),
            });
        });
    });
});
