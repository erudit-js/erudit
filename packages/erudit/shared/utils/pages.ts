import { sn } from 'unslash';
import type { TopicPart } from '@erudit-js/core/content/topic';

export const PAGES = {
  index: '/',
  contributors: '/contributors/',
  contributor: (contributorId?: string) => {
    return sn(`/contributor/${contributorId ?? ''}/`);
  },
  sponsors: '/sponsors/',
  ['book']: (shortId: string) => {
    return sn(`/book/${shortId}/`);
  },
  ['group']: (shortId: string) => {
    return sn(`/group/${shortId}/`);
  },
  ['page']: (shortId: string, elementId?: string) => {
    return sn(`/page/${shortId}/${elementId ? '?element=' + elementId : ''}`);
  },
  ['topic']: (part: TopicPart, shortId: string, elementId?: string) => {
    return sn(
      `/${part}/${shortId}/${elementId ? '?element=' + elementId : ''}`,
    );
  },
};
