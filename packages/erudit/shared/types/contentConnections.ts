import type { ContentExternals } from '@erudit-js/core/content/externals';
import type { ContentType } from '@erudit-js/core/content/type';

interface BaseContentDep {
  type: 'auto' | 'hard';
  contentType: ContentType;
  title: string;
  link: string;
}

/** A specific named element inside a page that was targeted by a <Dep> tag. */
export interface ContentDepUnique {
  name: string;
  title: string | undefined;
  link: string;
  schemaName: string;
}

export interface ContentAutoDep extends BaseContentDep {
  type: 'auto';
  uniques?: ContentDepUnique[];
}

export interface ContentHardDep extends BaseContentDep {
  type: 'hard';
  reason: string;
  uniques?: ContentDepUnique[];
}

export type ContentDep = ContentAutoDep | ContentHardDep;

export interface ContentConnections {
  hardDependencies?: ContentHardDep[];
  autoDependencies?: ContentAutoDep[];
  dependents?: ContentAutoDep[];
  externals?: ContentExternals;
}
