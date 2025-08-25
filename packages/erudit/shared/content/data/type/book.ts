import type { ContentBaseData } from '../base';
import type { ContentGroupLike } from '../groupLike';

export interface ContentBookData extends ContentBaseData {
    type: 'book';
    groupLike: ContentGroupLike;
}
