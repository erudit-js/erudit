import type { ContentBaseData } from '@shared/content/data/base';
import type { ContentGroupLike } from '@shared/content/data/groupLike';

export interface ContentBookData extends ContentBaseData {
    type: 'book';
    groupLike: ContentGroupLike;
}
