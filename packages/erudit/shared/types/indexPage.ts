export interface IndexPage {
    title: string;
    short: string;
    topImage?: {
        src: string;
        maxWidth?: string;
        invert?: 'light' | 'dark';
    };
    seo?: {
        title?: string;
        description?: string;
    };
    description?: string;
    stats?: ContentStats;
    contributors?: IndexPagePersons;
    sponsors?: IndexPagePersons;
    children?: MainContentChildrenItem[];
}

export type IndexPagePersons = Record<string, string | 0>;
