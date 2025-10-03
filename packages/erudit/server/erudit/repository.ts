import { getContentBreadcrumbs } from './content/repository/breadcrumbs';
import { getContentLink } from './content/repository/contentLink';

import { getTopicParts } from './content/repository/topicParts';
import { countContributors } from './contributors/repository/count';
import { resolveProse } from './prose/repository/resolveProse';
import { countSponsors } from './sponsors/repository/count';

export const repository = {
    contributors: {
        count: countContributors,
    },
    sponsors: {
        count: countSponsors,
    },
    content: {
        topicParts: getTopicParts,
        link: getContentLink,
        breadcrumbs: getContentBreadcrumbs,
    },
    prose: {
        resolve: resolveProse,
    },
} as const;

export type EruditServerRepository = typeof repository;

export async function setupServerRepository() {
    ERUDIT.repository = repository;
    ERUDIT.log.success('Repository setup complete!');
}
