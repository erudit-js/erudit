import type { Component } from 'vue';

import { PreviewDataType, type PreviewData } from './data';

import {
    LazyPreviewDisplayAlert,
    LazyPreviewDisplayCustom,
    LazyPreviewDisplayGenericLink,
    LazyPreviewDisplayPageLink,
    LazyPreviewDisplayUnique,
} from '#components';

import { createPreviewError } from './data/alert';

export interface PreviewDisplayProps<T extends PreviewData> {
    data: T;
}

export function getPreviewDisplayComponent(data: PreviewData): Component {
    switch (data.type) {
        case PreviewDataType.Alert:
            return LazyPreviewDisplayAlert;
        case PreviewDataType.Custom:
            return LazyPreviewDisplayCustom;
        case PreviewDataType.GenericLink:
            return LazyPreviewDisplayGenericLink;
        case PreviewDataType.PageLink:
            return LazyPreviewDisplayPageLink;
        case PreviewDataType.Unique:
            return LazyPreviewDisplayUnique;
    }

    throw createPreviewError({
        message: `Unable to build preview data for request!`,
        pre: JSON.stringify(data, null, 4),
    });
}
