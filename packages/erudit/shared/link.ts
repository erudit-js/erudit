import type {
    BitranLocation,
    ContentType,
    TopicPart,
} from '@erudit-js/cog/schema';

export function createBitranLocationLink(location: BitranLocation) {
    let link = `/${location.type}/${location.path}`;

    if (location.unique) link += `#${location.unique}`;

    return link;
}

export function createContentLink(contentType: ContentType, contentId: string) {
    // if (contentType === 'topic')
    //     throw Error(`Use 'createTopicPartLink' to create links to topics!`);

    return `/${contentType}/${contentId}`;
}

export function createTopicPartLink(topicPart: TopicPart, contentId: string) {
    return `/${topicPart}/${contentId}`;
}

export function createContributorLink(contributorId: string) {
    return `/contributor/${contributorId}`;
}
