export interface IndexPage {
    title: string;
    short: string;
    description?: string;
    logotype?: {
        src: string;
        maxWidth?: string;
        invert?: 'light' | 'dark';
    };
    stats?: ContentStats;
    contributorIds?: string[];
    sponsorIds?: string[];
    children?: MainContentChildrenItem[];
}
