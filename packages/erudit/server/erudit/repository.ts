import { getContentBreadcrumbs } from './content/repository/breadcrumbs';
import { getContentLink } from './content/repository/contentLink';
import {
    getDefaultTopicPart,
    getTopicParts,
} from './content/repository/topicParts';
import { countContributors } from './contributors/repository/count';
import { countSponsors } from './sponsors/repository/count';
import { resolveEruditProse } from './prose/repository/resolve';
import { pushFile } from './db/repository/pushFile';
import { pushProblemScript } from './db/repository/pushProblemScript';
import { pushProseLink } from './db/repository/pushProseLink';
import { getContentProse, getContributorProse } from './prose/repository/get';
import { finalizeProse } from './prose/repository/finalize';
import { getContentTitle } from './content/repository/title';
import {
    getContentHeadingUnique,
    getContentUnique,
} from './content/repository/unique';
import { getContentDecoration } from './content/repository/decoration';
import { getContentQuickLinks } from './content/repository/quickLinks';
import { getContentFlags } from './content/repository/flags';
import {
    getContentElementCounts,
    addContentElementCount,
} from './content/repository/elementCount';
import { getContentConnections } from './content/repository/connections';
import { getQuoteIds } from './quote/repository/ids';

export const repository = {
    db: {
        pushFile: pushFile,
        pushProblemScript: pushProblemScript,
        pushProseLink: pushProseLink,
    },
    contributors: {
        count: countContributors,
    },
    quotes: {
        ids: getQuoteIds,
    },
    sponsors: {
        count: countSponsors,
    },
    content: {
        topicParts: getTopicParts,
        defaultTopicPart: getDefaultTopicPart,
        unique: getContentUnique,
        uniqueHeading: getContentHeadingUnique,
        link: getContentLink,
        breadcrumbs: getContentBreadcrumbs,
        title: getContentTitle,
        decoration: getContentDecoration,
        quickLinks: getContentQuickLinks,
        flags: getContentFlags,
        addElementCount: addContentElementCount,
        elementCounts: getContentElementCounts,
        connections: getContentConnections,
    },
    prose: {
        resolve: resolveEruditProse,
        getContent: getContentProse,
        getContributor: getContributorProse,
        finalize: finalizeProse,
    },
} as const;

export type EruditServerRepository = typeof repository;

export async function setupServerRepository() {
    ERUDIT.repository = repository;
    ERUDIT.log.success('Repository setup complete!');
}
