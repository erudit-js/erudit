import {
    isContentType,
    isTopicPart,
    type ContentType,
    type TopicPart,
} from '@erudit-js/cog/schema';

import type { MyIconName } from '#my-icons';
import type { BitranLocation } from './bitran/location';

export const TOPIC_PART_ICON = {
    article: 'outline/file-lines',
    summary: 'file-star',
    practice: 'file-check',
} satisfies Record<TopicPart, MyIconName>;

export const CONTENT_TYPE_ICON = {
    book: 'outline/book',
    group: 'folder',
    topic: 'outline/file-lines',
} satisfies Record<ContentType, MyIconName>;

export const ICON = {
    contributor: 'user',
} satisfies Record<string, MyIconName>;

export function locationIcon(location: BitranLocation): MyIconName {
    if (isTopicPart(location.type)) return TOPIC_PART_ICON[location.type];

    if (isContentType(location.type)) return CONTENT_TYPE_ICON[location.type];

    switch (location.type) {
        case 'contributor':
            return ICON['contributor'];
    }

    return '__missing';
}
