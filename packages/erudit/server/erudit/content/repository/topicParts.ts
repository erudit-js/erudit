import type { TopicPart } from '@erudit-js/core/content/topic';
import { eq, sql } from 'drizzle-orm';

export async function getTopicParts(fullId: string): Promise<TopicPart[]> {
    const dbResult = await ERUDIT.db
        .select({
            hasArticle: sql<boolean>`(${ERUDIT.db.schema.topics.article} IS NOT NULL)`,
            hasSummary: sql<boolean>`(${ERUDIT.db.schema.topics.summary} IS NOT NULL)`,
            hasPractice: sql<boolean>`(${ERUDIT.db.schema.topics.practice} IS NOT NULL)`,
        })
        .from(ERUDIT.db.schema.topics)
        .where(eq(ERUDIT.db.schema.topics.fullId, fullId));

    const topic = dbResult?.[0];
    if (!topic) {
        return [];
    }

    const parts: TopicPart[] = [];

    if (topic.hasArticle) {
        parts.push('article');
    }

    if (topic.hasSummary) {
        parts.push('summary');
    }

    if (topic.hasPractice) {
        parts.push('practice');
    }

    return parts;
}
