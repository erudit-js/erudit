import type { ContentType } from '@erudit-js/cog/schema';

export interface NavNode {
    type: ContentType;
    path: string;
    idPart: string;
    shortId: string;
    fullId: string;
    skip: boolean;
    children?: NavNode[];
    parent?: NavNode | RootNavNode;
}

export interface RootNavNode {
    type: '#root';
    children?: NavNode[];
}

export function isRootNode(node: NavNode | RootNavNode) {
    return node?.type === '#root';
}

export function createRootNode(): RootNavNode {
    return {
        type: '#root',
    };
}
