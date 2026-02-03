export default defineEventHandler<Promise<AsideMajorPagesData>>(async () => {
  return {
    contributorsCount: ERUDIT.repository.contributors.count(),
    sponsorsCount: await ERUDIT.repository.sponsors.count(),
  };
});
