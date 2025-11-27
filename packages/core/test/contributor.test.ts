import { describe, expect, it } from 'vitest';

import { virtualContributorsModule } from '@erudit-js/core/contributor';

describe('Virtual contributors', () => {
    it('should create virtual contributors module', () => {
        const zeroContributorsModule = virtualContributorsModule([]);
        expect(zeroContributorsModule).toBe('export {};\n');

        const someContributorsModule = virtualContributorsModule([
            'contributorA',
            'contributorB',
            'test-contributor-c',
        ]);
        expect(someContributorsModule).toBe(
            'export {};\n' +
                "export const contributorA = { __ERUDIT_virtualContributor: true, contributorId: 'contributorA' } as const;\n" +
                "export const contributorB = { __ERUDIT_virtualContributor: true, contributorId: 'contributorB' } as const;\n" +
                "export const testContributorC = { __ERUDIT_virtualContributor: true, contributorId: 'test-contributor-c' } as const;\n",
        );
    });
});
