export default defineEventHandler<Promise<IndexPage>>(async () => {
    const title =
        ERUDIT.config.project.indexPage?.title ||
        ERUDIT.language.phrases.default_index_title;
    const short =
        ERUDIT.config.project.indexPage?.short ||
        ERUDIT.language.phrases.default_index_short;
    const descritpion = ERUDIT.config.project.indexPage?.description;

    const rootChildren = await ERUDIT.repository.content.children();

    const stats = await ERUDIT.repository.content.stats();

    const indexPage: IndexPage = {
        title,
        short,
    };

    if (descritpion) {
        indexPage.description = descritpion;
    }

    if (rootChildren.length > 0) {
        indexPage.children = rootChildren;
    }

    if (stats) {
        indexPage.stats = stats;
    }

    return indexPage;
});
