import type { TopicPart } from '../content/topic.js';
import type { ContentType } from '../content/type.js';

export type EruditSiteFaviconConfig =
    | Partial<
          { default?: string } & Exclude<Record<ContentType, string>, 'topic'> &
              Record<TopicPart, string>
      >
    | string;

export type EruditSiteFaviconResolved = Partial<
    { default: string } & Exclude<Record<ContentType, string>, 'topic'> &
        Record<TopicPart, string>
>;

export type EruditSite = Partial<{
    title: string;
    short: string | false;
    /**
     * - `string` — url to your logotype (use `projectPublic` to target path inside `public` directory)
     * - `false` — do not show logotype
     * - falsy (`0`, `undefined`, `null`, `""` and etc.) — use default Erudit logotype
     */
    logotype: string | false;
    favicon: EruditSiteFaviconConfig;
    style: Partial<{
        brandColor: string;
    }>;
    loadingSvg: string;
}>;
