import { isUnique } from '@jsprose/core';
import type { TopicPart } from '@erudit-js/core/content/topic';
import type { ContentType } from '@erudit-js/core/content/type';
import type { PreviewRequest } from '@erudit-js/core/preview/request';
import { parseDocumentId } from '@erudit-js/core/prose/documentId';
import {
  getGlobalContentPath,
  isGlobalContent,
} from '@erudit-js/core/content/global';

import type { LinkToProp } from './core.js';

export type LinkStorageType = 'external' | 'contentItem' | 'unique';

interface LinkStorageBase {
  type: LinkStorageType;
  resolvedHref: string;
  previewRequest: PreviewRequest;
}

export type LinkStorageContent = {
  contentTitle: string;
} & (
  | {
      contentType: 'topic';
      topicPart: TopicPart;
    }
  | {
      contentType: Exclude<ContentType, 'topic'>;
    }
);

export interface ExternalLinkStorage extends LinkStorageBase {
  type: 'external';
}

export interface ContentItemLinkStorage extends LinkStorageBase {
  type: 'contentItem';
  content: LinkStorageContent;
}

export interface UniqueLinkStorage extends LinkStorageBase {
  type: 'unique';
  schemaName: string;
  elementTitle?: string;
  content: LinkStorageContent;
}

export interface ErrorLinkStorage {
  type: 'error';
  error: string;
}

export type LinkStorage =
  | ExternalLinkStorage
  | ContentItemLinkStorage
  | UniqueLinkStorage
  | ErrorLinkStorage;

export function createLinkStorageKey(to: LinkToProp): string {
  if (isUnique(to)) {
    const documentId = parseDocumentId(to.documentId);

    if (documentId.type === 'contentPage') {
      return `<link:global>/${documentId.contentId}/$${to.name}`;
    } else if (documentId.type === 'contentTopic') {
      return `<link:global>/${documentId.contentId}/${documentId.topicPart}/$${to.name}`;
    }
  }

  if (isGlobalContent(to)) {
    return `<link:global>/${getGlobalContentPath(to)}`;
  }

  if (typeof to === 'string') {
    return `<link:external>/${to}`;
  }

  return `<link:unknown>/${JSON.stringify(to)}`;
}
