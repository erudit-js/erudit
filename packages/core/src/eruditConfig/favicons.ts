import type { TopicPart } from '../content/topic.js';
import type { ContentType } from '../content/type.js';

export type EruditFavicons =
  | Partial<
      { default?: string } & Exclude<Record<ContentType, string>, 'topic'> &
        Record<TopicPart, string>
    >
  | string;

export type EruditFaviconsResolved = Partial<
  { default: string } & Exclude<Record<ContentType, string>, 'topic'> &
    Record<TopicPart, string>
>;
