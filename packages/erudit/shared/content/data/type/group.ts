import type { ContentBaseData } from '../base';
import type { ContentGroupLike } from '../groupLike';

export interface ContentGroupData extends ContentBaseData {
    type: 'group';
    groupLike: ContentGroupLike;
    bookTitle?: string;
}
