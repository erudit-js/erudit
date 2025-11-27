import { getContentBreadcrumbs } from './content/repository/breadcrumbs';
import { getContentLink } from './content/repository/contentLink';
import { getTopicParts } from './content/repository/topicParts';
import { countContributors } from './contributors/repository/count';
import { countSponsors } from './sponsors/repository/count';
import { applyResolvedFiles } from './prose/repository/resolvedFiles';
import { resolveEruditProse } from './prose/repository/resolve';

// import { getProseFor } from './prose/repository/get';
// import { parseEruditJsx } from './prose/repository/parseJsx';
// import { getUniqueData } from './prose/repository/unique';

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
        resolve: resolveEruditProse,
        applyResolved: {
            files: applyResolvedFiles,
        },
        // parse: parseEruditJsx,
        // unique: getUniqueData,
        // get: getProseFor,
    },
} as const;

export type EruditServerRepository = typeof repository;

export async function setupServerRepository() {
    ERUDIT.repository = repository;
    ERUDIT.log.success('Repository setup complete!');
}
