import { ContentType, TopicPart } from '@erudit-js/cog/schema';

export const PAGES = {
    index: '/',
    contributors: '/contributors/',
    contributor: (contributorId?: string) => {
        return slasher(`/contributor/${contributorId ?? ''}/`);
    },
    sponsors: '/sponsors/',
    [ContentType.Book]: (shortId: string) => {
        return slasher(`/book/${shortId}/`);
    },
    [ContentType.Group]: (shortId: string) => {
        return slasher(`/group/${shortId}/`);
    },
    [ContentType.Page]: (shortId: string) => {
        return slasher(`/page/${shortId}/`);
    },
    [ContentType.Topic]: (part: TopicPart, shortId: string) => {
        return slasher(`/${part}/${shortId}/`);
    },
};
