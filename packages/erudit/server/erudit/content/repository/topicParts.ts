import { eq, sql } from 'drizzle-orm';
import { TopicPart } from '@erudit-js/cog/schema';

export async function getTopicParts(fullId: string): Promise<TopicPart[]> {
    const dbResult = await ERUDIT.db
        .select({
            hasArticle: sql<boolean>`(${ERUDIT.db.schema.topics.parsedArticle} IS NOT NULL)`,
            hasSummary: sql<boolean>`(${ERUDIT.db.schema.topics.parsedSummary} IS NOT NULL)`,
            hasPractice: sql<boolean>`(${ERUDIT.db.schema.topics.parsedPractice} IS NOT NULL)`,
        })
        .from(ERUDIT.db.schema.topics)
        .where(eq(ERUDIT.db.schema.topics.fullId, fullId));

    const topic = dbResult?.[0];
    if (!topic) {
        return [];
    }

    const parts: TopicPart[] = [];

    if (topic.hasArticle) {
        parts.push(TopicPart.Article);
    }

    if (topic.hasSummary) {
        parts.push(TopicPart.Summary);
    }

    if (topic.hasPractice) {
        parts.push(TopicPart.Practice);
    }

    return parts;
}
