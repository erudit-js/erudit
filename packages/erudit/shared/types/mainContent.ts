import type { ContentType, TopicPart } from '@erudit-js/cog/schema';
import type { BlocksSchema } from '@erudit-js/prose/default/blocks/index';

interface Base {
    type: ContentType;
    breadcrumbs: Breadcrumbs;
}

export interface MainContentTopicPart
    extends Base,
        ResolvedProse<BlocksSchema> {
    type: ContentType.Topic;
    part: TopicPart;
}

export interface MainContentPage extends Base, ResolvedProse<BlocksSchema> {
    type: ContentType.Page;
}

export type MainContent = MainContentTopicPart | MainContentPage;
