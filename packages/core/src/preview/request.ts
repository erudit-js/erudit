import type { PreviewType } from './type.js';
import type { ContentType } from '../content/type.js';
import type { TopicPart } from '../content/topic.js';

interface BasePreviewRequest {
  type: PreviewType;
}

export interface PreviewRequestDirectLink extends BasePreviewRequest {
  type: 'direct-link';
  href: string;
}

export type PreviewRequestContentPage = BasePreviewRequest & {
  type: 'content-page';
  fullId: string;
} & (
    | { contentType: 'topic'; topicPart: TopicPart }
    | { contentType: Exclude<ContentType, 'topic'> }
  );

export type PreviewRequestUnique = BasePreviewRequest & {
  type: 'unique';
  contentFullId: string;
  uniqueName: string;
} & (
    | { contentType: 'topic'; topicPart: TopicPart }
    | { contentType: Exclude<ContentType, 'topic'> }
  );

export type PreviewRequest =
  | PreviewRequestDirectLink
  | PreviewRequestContentPage
  | PreviewRequestUnique;
