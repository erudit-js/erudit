import { countContributors } from './contributors/repository/count';
import { countSponsors } from './sponsors/repository/count';

export const repository = {
    contributors: {
        count: countContributors,
    },
    sponsors: {
        count: countSponsors,
    },
} as const;

export type EruditServerRepository = typeof repository;

export async function setupServerRepository() {
    ERUDIT.repository = repository;
    ERUDIT.log.success('Repository setup complete!');
}
