import type {
    ContentConfigPage,
    ContentConfigTopic,
} from '@erudit-js/cog/schema';

export { defineProblemScript } from '@erudit-js/prose/elements/problem/problemScript';

export function defineBook(book: Partial<ContentConfigPage>) {
    return book;
}

export function definePage(page: Partial<ContentConfigPage>) {
    return page;
}

export function defineTopic(topic: Partial<ContentConfigTopic>) {
    return topic;
}

export function defineGroup(group: Partial<ContentConfigTopic>) {
    return group;
}
