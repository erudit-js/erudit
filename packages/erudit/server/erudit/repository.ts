import { getContentBreadcrumbs } from './content/repository/breadcrumbs';
import { getContentLink } from './content/repository/contentLink';

import { getTopicParts } from './content/repository/topicParts';
import { countContributors } from './contributors/repository/count';
import { getProseFor } from './prose/repository/get';
import { parseEruditJsx } from './prose/repository/parseJsx';
import { resolveProse } from './prose/repository/resolveProse';
import { getUniqueData } from './prose/repository/unique';
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
        parse: parseEruditJsx,
        unique: getUniqueData,
        get: getProseFor,
    },
} as const;

export type EruditServerRepository = typeof repository;

export async function setupServerRepository() {
    ERUDIT.repository = repository;
    ERUDIT.log.success('Repository setup complete!');
}
