export default defineEventHandler(async (event) => {
  const { batchIndex } = event.context.params as { batchIndex: string };
  const batch = await ERUDIT.repository.news.batch(parseInt(batchIndex, 10));
  return batch;
});
