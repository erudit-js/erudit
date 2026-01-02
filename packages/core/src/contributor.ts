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
// Contributors Global
//

declare const globalContributorBrand: unique symbol;

export interface GlobalContributorTypeguard {
    [globalContributorBrand]: true;
}

export function contributorIdToPropertyName(contributorId: string): string {
    return contributorId
        .split('-')
        .map((p, i) => (i === 0 ? p : p.charAt(0).toUpperCase() + p.slice(1)))
        .join('');
}

export function globalContributorsObject(
    contributorIds: string[],
): Record<string, string> {
    const contributors: Record<string, string> = {};

    for (const contributorId of contributorIds) {
        const exportName = contributorIdToPropertyName(contributorId);

        if (contributors[exportName]) {
            throw new Error(
                `Duplicate contributor export name detected: "${exportName}" (from contributor ID: "${contributorId}")!`,
            );
        }

        contributors[exportName] = contributorId;
    }

    return contributors;
}

export function globalContributorsTypes(
    contributors: Record<string, string>,
): string {
    return `import type { GlobalContributorTypeguard } from '@erudit-js/core/contributor';

export {};

declare global {
    const $CONTRIBUTOR: {
${Object.keys(contributors)
    .map(
        (contributorId) =>
            `        ${contributorId}: GlobalContributorTypeguard;`,
    )
    .join('\n')}
    };
}
`;
}
