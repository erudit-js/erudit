import type { AnySchema, RawElement } from '@jsprose/core';

export type ContributorDefinition = Partial<{
    displayName: string;
    slogan: string;
    editor: boolean;
    links: Record<string, string>;
    description: RawElement<AnySchema>;
}>;

export function defineContributor(contributor: ContributorDefinition) {
    return contributor;
}

//
// Virtual Contributors
//

export interface VirtualContributor {
    __ERUDIT_virtualContributor: true;
    contributorId: string;
}

/**
 * You can access virtual contributors via `#contributors` virtual module:
 * ```ts
 * import { fooContributor, barContributor } from '#contributors';
 *
 * export default defineTopic({
 *   contributors: {
 *     fooContributor,
 *     barContributor,
 *   },
 * });
 * ```
 */
export type VirtualContributors = Record<string, VirtualContributor>;

export function virtualContributorsModule(contributorIds: string[]) {
    let module = 'export {};\n';

    for (const contributorId of contributorIds) {
        const exportName = contributorId
            .split('-')
            .map((p, i) =>
                i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1),
            )
            .join('');

        module += `export const ${exportName} = { __ERUDIT_virtualContributor: true, contributorId: '${contributorId}' } as const;\n`;
    }

    return module;
}
