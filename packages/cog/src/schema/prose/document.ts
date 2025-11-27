import { ContentProseType, ProseType } from './type';

interface DocumentBase {
    documentId: string; // stringified link
    type: ProseType;
    title: string;
}

export interface ContentDocument extends DocumentBase {
    type: ContentProseType;
    contentFullId: string;
}

export interface NewsPostDocument extends DocumentBase {
    type: 'newsPost';
    publishDate: string;
}

export type ProseDocument = ContentDocument | NewsPostDocument;
