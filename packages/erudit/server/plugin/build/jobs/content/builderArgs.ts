import type { DbContent } from '@server/db/entities/Content';
import type { NavNode } from '@server/nav/node';

export interface BuilderFunctionArgs<T = any> {
    navNode: NavNode;
    dbContent: DbContent;
    config?: Partial<T>;
}
