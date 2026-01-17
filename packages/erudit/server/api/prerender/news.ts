export default defineEventHandler(async () => {
    const routes = new Set<string>(['/api/news/batch/0']);
    const batchesNumber = await ERUDIT.repository.news.countBatches();
    for (let batch = 0; batch < batchesNumber; batch++) {
        routes.add(`/api/news/batch/${batch}`);
    }
    return Array.from(routes);
});
