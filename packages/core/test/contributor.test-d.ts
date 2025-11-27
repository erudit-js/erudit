import { describe, it } from 'vitest';

import type {
    VirtualContributor,
    VirtualContributors,
} from '@erudit-js/core/contributor';

describe('Virtual contributors', () => {
    it('should be able to cast specific virtual contributor to generic VirtualContributor', () => {
        const fooContributor = {
            __ERUDIT_virtualContributor: true,
            contributorId: 'fooContributor',
        } as const;

        const anyContributor: VirtualContributor = fooContributor;

        const barContributor: VirtualContributor = {
            __ERUDIT_virtualContributor: true,
            contributorId: 'barContributor',
        } as const;

        const wrongContributor = {
            contributorId: 'wrongContributor',
        } as const;

        const contributorsObj: VirtualContributors = {
            fooContributor,
            barContributor,
            // @ts-expect-error
            wrongContributor,
        };
    });
});
