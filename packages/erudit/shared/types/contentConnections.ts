import type { ContentExternal } from '@erudit-js/core/content/externals';
import type { ContentType } from '@erudit-js/core/content/type';

interface BaseContentDep {
    type: 'auto' | 'hard';
    contentType: ContentType;
    title: string;
    link: string;
}

export interface ContentAutoDep extends BaseContentDep {
    type: 'auto';
}

export interface ContentHardDep extends BaseContentDep {
    type: 'hard';
    reason: string;
}

export type ContentDep = ContentAutoDep | ContentHardDep;

export interface ContentConnections {
    hardDependencies?: ContentHardDep[];
    autoDependencies?: ContentAutoDep[];
    dependents?: ContentAutoDep[];
    externals?: ContentExternal[];
}
