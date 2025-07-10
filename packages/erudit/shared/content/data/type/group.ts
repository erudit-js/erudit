import type { ContentBaseData } from '@shared/content/data/base';
import type { ContentGroupLike } from '@shared/content/data/groupLike';

export interface ContentGroupData extends ContentBaseData {
    type: 'group';
    groupLike: ContentGroupLike;
    bookTitle?: string;
}
