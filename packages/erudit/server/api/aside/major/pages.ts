export default defineEventHandler<Promise<AsideMajorPagesData>>(async () => {
    return {
        contributorsCount: await ERUDIT.repository.contributors.count(),
        sponsorsCount: ERUDIT.repository.sponsors.count().all,
    };
});
