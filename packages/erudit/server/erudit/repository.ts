import { getContentBreadcrumbs } from './content/repository/breadcrumbs';
import { getContentLink } from './content/repository/contentLink';
import { getTopicParts } from './content/repository/topicParts';
import { countContributors } from './contributors/repository/count';
import { countSponsors } from './sponsors/repository/count';
import { resolveEruditProse } from './prose/repository/resolve';
import { pushFile } from './db/repository/pushFile';
import { pushProblemScript } from './db/repository/pushProblemScript';
import { pushProseLink } from './db/repository/pushProseLink';

// import { getProseFor } from './prose/repository/get';
// import { parseEruditJsx } from './prose/repository/parseJsx';
// import { getUniqueData } from './prose/repository/unique';

export const repository = {
    db: {
        pushFile: pushFile,
        pushProblemScript: pushProblemScript,
        pushProseLink: pushProseLink,
    },
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
