import type {
    BookConfig,
    ContentReferences,
    ContentReferenceSource,
    GroupConfig,
    TopicConfig,
} from '@erudit-js/cog/schema';

export function defineBook(book: Partial<BookConfig>) {
    return book;
}

export function defineGroup(group: Partial<GroupConfig>) {
    return group;
}

export function defineTopic(topic: Partial<TopicConfig>) {
    return topic;
}

export function defineContentReferences(references: ContentReferences) {
    return references;
}

export function defineContentSource(source: ContentReferenceSource) {
    return source;
}
