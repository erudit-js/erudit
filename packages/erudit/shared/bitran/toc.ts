export interface TocItem {
    id: string;
    level: number;
    productName: string;
    title?: string;
}

export type Toc = TocItem[];
