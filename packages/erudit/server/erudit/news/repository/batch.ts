import { count } from 'drizzle-orm';

const newsNumberPerBatch = 20;

export async function countNewsBatches(): Promise<number> {
  const newsTotal = await ERUDIT.db
    .select({ count: count() })
    .from(ERUDIT.db.schema.news)
    .then((result) => result[0]!.count);

  return Math.ceil(newsTotal / newsNumberPerBatch);
}

export async function getNewsNextBatch(index: number): Promise<NewsBatch> {
  const newsTotal = await ERUDIT.db
    .select({ count: count() })
    .from(ERUDIT.db.schema.news)
    .then((result) => result[0]!.count);

  const dbNews = await ERUDIT.db.query.news.findMany({
    columns: {
      date: true,
      prose: true,
    },
    orderBy: (news, { desc }) => [desc(news.date)],
    limit: newsNumberPerBatch,
    offset: index * newsNumberPerBatch,
  });

  const items: NewsItem[] = [];

  for (const dbNewsItem of dbNews) {
    const date = dbNewsItem.date;
    const finalizedProse = await ERUDIT.repository.prose.finalize(
      dbNewsItem.prose,
    );

    const item: NewsItem = {
      date,
      content: finalizedProse,
    };

    items.push(item);
  }

  const hasNext = (index + 1) * newsNumberPerBatch < newsTotal;

  const batch: NewsBatch = {
    items,
  };

  if (hasNext) {
    batch.nextIndex = index + 1;
  }

  if (index === 0) {
    batch.total = newsTotal;
  }

  return batch;
}
