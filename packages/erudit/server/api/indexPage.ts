export default defineEventHandler<Promise<IndexPage>>(async () => {
    const title =
        ERUDIT.config.indexPage?.title ||
        ERUDIT.language.phrases.default_index_title;

    const short =
        ERUDIT.config.indexPage?.short ||
        ERUDIT.language.phrases.default_index_short;

    const indexPage: IndexPage = {
        title,
        short,
    };

    const description = ERUDIT.config.indexPage?.description;

    if (description) {
        indexPage.description = description;
    }

    const topImage = ERUDIT.config.indexPage?.topImage;

    if (topImage) {
        indexPage.topImage = topImage;
    }

    const rootChildren = await ERUDIT.repository.content.children();

    if (rootChildren.length > 0) {
        indexPage.children = rootChildren;
    }

    const stats = await ERUDIT.repository.content.stats();

    if (stats) {
        indexPage.stats = stats;
    }

    const seo = ERUDIT.config.indexPage?.seo;
    if (seo) {
        indexPage.seo = seo;
    }

    {
        const dbContributors = await ERUDIT.db.query.contributors.findMany({
            columns: {
                contributorId: true,
                avatarExtension: true,
            },
        });

        if (dbContributors.length > 0) {
            indexPage.contributors = Object.fromEntries(
                dbContributors.map((contributor) => [
                    contributor.contributorId,
                    contributor.avatarExtension || 0,
                ]),
            );
        }
    }

    {
        const dbSponsors = await ERUDIT.db.query.sponsors.findMany({
            columns: {
                sponsorId: true,
                avatarExtension: true,
            },
        });

        if (dbSponsors.length > 0) {
            indexPage.sponsors = Object.fromEntries(
                dbSponsors.map((sponsor) => [
                    sponsor.sponsorId,
                    sponsor.avatarExtension || 0,
                ]),
            );
        }
    }

    return indexPage;
});
