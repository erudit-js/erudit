import type { ContentToc } from './content/toc';
import type { ElementStats } from './stat';

export interface IndexData {
    elementStats: ElementStats;
    topicCount: number;
    contributors: [string, string | undefined][];
    sponsors: [string, string | undefined][];
    contentToc?: ContentToc;
}
