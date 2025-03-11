import type {
    BookConfig,
    ContentReferences,
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
