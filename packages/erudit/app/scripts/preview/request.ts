import type { LinkData } from '@erudit/shared/bitran/link/shared';
import type { LinkTarget } from '@erudit/shared/bitran/link/target';

import type { PreviewData } from './data';

export enum PreviewRequestType {
    Link = 'link',
    Data = 'data',
    MissingElement = 'missing-element',
    HashMismatch = 'hash-mismatch',
}

export interface PreviewRequestData extends PreviewRequestBase {
    type: PreviewRequestType.Data;
    data: PreviewData;
}

export interface PreviewRequestLink extends PreviewRequestBase {
    type: PreviewRequestType.Link;
    linkData: LinkData;
    linkTarget: LinkTarget;
}

export interface PreviewRequestMissingElement extends PreviewRequestBase {
    type: PreviewRequestType.MissingElement;
    elementId: string;
    hashMismatch?: {
        current: string;
        expected: string;
    };
}

export interface PreviewRequestHashMismatch extends PreviewRequestBase {
    type: PreviewRequestType.HashMismatch;
    currentHash: string;
    expectedHash: string;
}

export type PreviewRequest =
    | PreviewRequestData
    | PreviewRequestLink
    | PreviewRequestMissingElement
    | PreviewRequestHashMismatch;

//
//
//

interface PreviewRequestBase {
    type: `${PreviewRequestType}`;
}
