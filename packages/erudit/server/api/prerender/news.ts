export default defineEventHandler(async () => {
    const routes: string[] = [];
    const batchesNumber = await ERUDIT.repository.news.countBatches();
    for (let batch = 0; batch < batchesNumber; batch++) {
        routes.push(`/api/news/batch/${batch}`);
    }
    return routes;
});
