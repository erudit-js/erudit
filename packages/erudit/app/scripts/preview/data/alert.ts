import { PreviewDataType, type PreviewDataBase } from '../data';
import { PreviewThemeName } from '../state';

export type AlertData = Partial<{
    theme: PreviewThemeName;
    title: string;
    message: string;
    pre: string;
}>;

export type PreviewDataAlert = PreviewDataBase & AlertData;

export function createPreviewError(alertData: AlertData): PreviewDataAlert {
    return {
        type: PreviewDataType.Alert,
        theme: PreviewThemeName.Error,
        ...alertData,
    };
}
