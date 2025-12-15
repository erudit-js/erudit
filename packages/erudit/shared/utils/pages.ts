import type { TopicPart } from '@erudit-js/core/content/topic';

export const PAGES = {
    index: '/',
    contributors: '/contributors/',
    contributor: (contributorId?: string) => {
        return slasher(`/contributor/${contributorId ?? ''}/`);
    },
    sponsors: '/sponsors/',
    ['book']: (shortId: string) => {
        return slasher(`/book/${shortId}/`);
    },
    ['group']: (shortId: string) => {
        return slasher(`/group/${shortId}/`);
    },
    ['page']: (shortId: string, elementId?: string) => {
        return slasher(`/page/${shortId}/${elementId ? '#' + elementId : ''}`);
    },
    ['topic']: (part: TopicPart, shortId: string, elementId?: string) => {
        return slasher(
            `/${part}/${shortId}/${elementId ? '#' + elementId : ''}`,
        );
    },
};
