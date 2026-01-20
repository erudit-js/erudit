export interface ElementSnippet {
    schemaName: string;
    link: string;
    title: string;
    description?: string;
    quick?: {
        title?: string;
        description?: string;
    };
    seo?: {
        title?: string;
        description?: string;
    };
}
