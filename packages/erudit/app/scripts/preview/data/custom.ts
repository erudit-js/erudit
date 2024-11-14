import type { PreviewDataBase, PreviewDataType } from '../data';
import type { PreviewFooter } from '../footer';

export interface PreviewDataCustom extends PreviewDataBase {
    type: PreviewDataType.Custom;
    message: string;
    footer?: PreviewFooter;
}
