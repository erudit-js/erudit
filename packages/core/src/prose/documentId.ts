import { contentPathToId } from '../content/path.js';
import type { TopicPart } from '../content/topic.js';

export interface ContentPageDocumentId {
    type: 'contentPage';
    contentId: string;
}

export interface ContentTopicDocumentId {
    type: 'contentTopic';
    contentId: string;
    topicPart: TopicPart;
}

export interface NewsItemDocumentId {
    type: 'newsItem';
    newsItemId: string; // ? date-based ID ?
}

export type DocumentId =
    | ContentPageDocumentId
    | ContentTopicDocumentId
    | NewsItemDocumentId;

export function stringifyDocumentId(documentId: DocumentId): string {
    switch (documentId.type) {
        case 'contentPage':
            return `contentPage/${documentId.contentId}`;
        case 'contentTopic':
            return `contentTopic/${documentId.topicPart}/${documentId.contentId}`;
        case 'newsItem':
            throw new Error('To be implemented'); // @TODO: Implement newsItem
    }
}

export function parseDocumentId(strDocumentId: string): DocumentId {
    const parts = strDocumentId.split('/');
    const type = parts.shift()! as DocumentId['type'];

    switch (type) {
        case 'contentPage':
            return {
                type: 'contentPage',
                contentId: parts.join('/'),
            };
        case 'contentTopic':
            const topicPart = parts.shift()! as TopicPart;
            return {
                type: 'contentTopic',
                topicPart,
                contentId: parts.join('/'),
            };
    }

    // @TODO: implement newsItem

    throw new Error(
        `Inable to parse document ID from string: ${strDocumentId}`,
    );
}

export function pathToDocumentId(
    path: string,
    projectPath: string,
): DocumentId | undefined {
    if (path.startsWith(`${projectPath}/content/`)) {
        const fullContentId = contentPathToId(path, projectPath, 'full');
        if (fullContentId) {
            const lastPart = path.split('/').pop();
            switch (lastPart) {
                case 'page.tsx':
                    return {
                        type: 'contentPage',
                        contentId: fullContentId,
                    };
                case 'article.tsx':
                    return {
                        type: 'contentTopic',
                        topicPart: 'article',
                        contentId: fullContentId,
                    };
                case 'summary.tsx':
                    return {
                        type: 'contentTopic',
                        topicPart: 'summary',
                        contentId: fullContentId,
                    };
                case 'practice.tsx':
                    return {
                        type: 'contentTopic',
                        topicPart: 'practice',
                        contentId: fullContentId,
                    };
            }
        }
    }

    // @TODO: implement newsItem
}
