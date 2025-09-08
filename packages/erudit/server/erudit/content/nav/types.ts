import { ContentType } from '@erudit-js/cog/schema';

import * as repository from './repository';

export type ContentNavMap = Map<string, ContentNavNode>;
export type Id2Id = Map<string, string>;

export type EruditServerContentNav = {
    id2Node: ContentNavMap;
    id2Root: ContentNavMap;
    id2Books: ContentNavMap;
    short2Full: Id2Id;
} & typeof repository;

export interface ContentNavNode {
    idPart: string;
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
