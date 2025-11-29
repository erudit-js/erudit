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
    ['page']: (shortId: string, domId?: string) => {
        return slasher(`/page/${shortId}/${domId ? '#' + domId : ''}`);
    },
    ['topic']: (part: TopicPart, shortId: string, domId?: string) => {
        return slasher(`/${part}/${shortId}/${domId ? '#' + domId : ''}`);
    },
};
