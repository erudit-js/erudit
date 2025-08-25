import { SPONSORS } from '..';

export function countSponsors() {
    const tier1Count = Object.keys(SPONSORS.tier1).length;
    const tier2Count = Object.keys(SPONSORS.tier2).length;

    return {
        tier1: tier1Count,
        tier2: tier2Count,
        all: tier1Count + tier2Count,
    };
}
