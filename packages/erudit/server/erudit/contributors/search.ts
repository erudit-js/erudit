export const searchCategoryContributors: SearchEntryCategory = {
    id: 'contributors',
    priority: 100,
};

export async function searchIndexContributors(): Promise<SearchEntriesList> {
    const dbContributors = await ERUDIT.db.query.contributors.findMany({
        columns: {
            contributorId: true,
            displayName: true,
        },
    });

    return {
        category: searchCategoryContributors,
        entries: dbContributors.map((dbContributor) => {
            const entry: SearchEntry = {
                category: searchCategoryContributors.id,
                title: dbContributor.displayName || dbContributor.contributorId,
                link: PAGES.contributor(dbContributor.contributorId),
            };

            const hasDisplayName = !!dbContributor.displayName;
            const displaySameAsId =
                dbContributor.displayName === dbContributor.contributorId;

            if (hasDisplayName && !displaySameAsId) {
                entry.synonyms = [dbContributor.contributorId];
            }

            return entry;
        }),
    };
}
