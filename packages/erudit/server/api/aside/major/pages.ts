export default defineEventHandler<Promise<AsideMajorPagesData>>(async () => {
    return {
        contributorsCount: ERUDIT.repository.contributors.count(),
        sponsorsCount: ERUDIT.repository.sponsors.count().all,
    };
});
