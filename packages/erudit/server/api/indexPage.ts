export default defineEventHandler<Promise<IndexPage>>(async () => {
    const title =
        ERUDIT.config.project.indexPage?.title ||
        ERUDIT.language.phrases.default_index_title;

    const short =
        ERUDIT.config.project.indexPage?.short ||
        ERUDIT.language.phrases.default_index_short;

    const indexPage: IndexPage = {
        title,
        short,
    };

    const descritpion = ERUDIT.config.project.indexPage?.description;

    if (descritpion) {
        indexPage.description = descritpion;
    }

    const logoytpe = ERUDIT.config.project.indexPage?.logotype;

    if (logoytpe) {
        indexPage.logotype = logoytpe;
    }

    const rootChildren = await ERUDIT.repository.content.children();

    if (rootChildren.length > 0) {
        indexPage.children = rootChildren;
    }

    const stats = await ERUDIT.repository.content.stats();

    if (stats) {
        indexPage.stats = stats;
    }

    const seo = ERUDIT.config.project.indexPage?.seo;
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
