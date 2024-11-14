import type { ContentBaseData } from '../base';

export interface ContentGroupData extends ContentBaseData {
    type: 'group';
    bookTitle?: string;
}
