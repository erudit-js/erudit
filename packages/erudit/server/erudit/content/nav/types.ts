import { ContentType } from '@erudit-js/cog/schema';

import * as repository from './repository';

export type EruditServerContentNav = {
    rootNodes: ContentNavNode[];
} & typeof repository;

export interface ContentNavNode {
    fullId: string;
    shortId: string;
    contentRelPath: string;
    position: number;
    skip: boolean;
    hide: boolean;
    type: ContentType;
    parent?: ContentNavNode;
    children?: ContentNavNode[];
}
