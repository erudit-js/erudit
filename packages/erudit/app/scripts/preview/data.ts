import type { PreviewDataAlert } from './data/alert';
import type { PreviewDataCustom } from './data/custom';
import type { PreviewDataGenericLink } from './data/genericLink';
import type { PreviewDataPageLink } from './data/pageLink';
import type { PreviewDataUnique } from './data/unique';

export enum PreviewDataType {
    Alert = 'alert',
    Custom = 'custom',
    GenericLink = 'generic-link',
    PageLink = 'page-link',
    Unique = 'unique',
}

export interface PreviewDataBase {
    type: `${PreviewDataType}`;
}

export type PreviewData =
    | PreviewDataAlert
    | PreviewDataCustom
    | PreviewDataGenericLink
    | PreviewDataPageLink
    | PreviewDataUnique;
