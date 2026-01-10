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

import { getContentConnections } from './content/repository/connections';
import { getQuoteIds } from './quote/repository/ids';
import { countContributions } from './contributors/repository/countContributions';
import { getContributorAvatarUrl } from './contributors/repository/avatarUrl';
import { getSponsorAvatarUrl } from './sponsors/repository/avatarUrl';
import { getContentDescription } from './content/repository/description';
import { getContentChildren } from './content/repository/children';
import {
    addContentElementCount,
    getContentStats,
} from './content/repository/stats';
import { countNewsBatches, getNewsNextBatch } from './news/repository/batch';

export const repository = {
    db: {
        pushFile: pushFile,
        pushProblemScript: pushProblemScript,
        pushProseLink: pushProseLink,
    },
    contributors: {
        count: countContributors,
        countContributions,
        avatarUrl: getContributorAvatarUrl,
    },
    quotes: {
        ids: getQuoteIds,
    },
    sponsors: {
        count: countSponsors,
        avatarUrl: getSponsorAvatarUrl,
    },
    content: {
        topicParts: getTopicParts,
        defaultTopicPart: getDefaultTopicPart,
        unique: getContentUnique,
        uniqueHeading: getContentHeadingUnique,
        link: getContentLink,
        breadcrumbs: getContentBreadcrumbs,
        title: getContentTitle,
        description: getContentDescription,
        decoration: getContentDecoration,
        quickLinks: getContentQuickLinks,
        flags: getContentFlags,
        connections: getContentConnections,
        children: getContentChildren,
        stats: getContentStats,
        addElementCount: addContentElementCount,
    },
    prose: {
        resolve: resolveEruditProse,
        getContent: getContentProse,
        getContributor: getContributorProse,
        finalize: finalizeProse,
    },
    news: {
        countBatches: countNewsBatches,
        batch: getNewsNextBatch,
    },
} as const;

export type EruditServerRepository = typeof repository;

export async function setupServerRepository() {
    ERUDIT.repository = repository;
    ERUDIT.log.success('Repository setup complete!');
}
