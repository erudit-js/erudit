import { describe, expect, it } from 'vitest';
import { defineDocument, isolateProse, PROSE_REGISTRY } from '@jsprose/core';

import { resolveEruditRawElement } from '@erudit-js/prose';
import {
    P,
    paragraphRegistryItem,
} from '@erudit-js/prose/elements/paragraph/core';
import {
    stringifyDocumentId,
    type DocumentId,
} from '@erudit-js/core/prose/documentId';

describe('resolveEruditRawElement', () => {
    it('should collect unique titles from raw elements', async () => {
        await isolateProse(async () => {
            PROSE_REGISTRY.setItems(paragraphRegistryItem);

            const documentLink: DocumentId = {
                type: 'contentTopic',
                topicPart: 'article',
                contentId: 'topic-999/article-888',
            };

            const document = defineDocument(stringifyDocumentId(documentLink), {
                uniques: {
                    myFirstP: P,
                    mySecondP: P,
                },
            })(({ uniques }) => (
                <>
                    <P $={uniques.myFirstP} toc="First Title">
                        This is the first paragraph.
                    </P>
                    <P toc="Not tracked title">Not tracked P title.</P>
                    <P
                        $={uniques.mySecondP}
                        snippet={{ title: 'Second Title' }}
                        quick
                    >
                        This is the second paragraph.
                    </P>
                </>
            ));

            const { uniqueTitles } = await resolveEruditRawElement({
                context: {
                    language: 'en',
                    linkable: true,
                },
                rawElement: document.content,
            });

            expect(uniqueTitles).toEqual({
                myFirstP: 'First Title',
                mySecondP: 'Second Title',
            });
        });
    });
});
