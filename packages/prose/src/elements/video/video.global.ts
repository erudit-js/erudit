import type { ElementSchema } from '../../schema';
import type { InvertOption } from '../../shared';
import type { ElementType } from '../../type';
import type { CaptionSchema } from '../caption/caption.global';

export const videoName = 'video';

export interface VideoData {
    src: string;
    invert?: InvertOption;
    width?: string;
}

export interface VideoStorage {
    resolvedSrc: string;
}

export type VideoSchema = ElementSchema<{
    Type: ElementType.Block;
    Name: typeof videoName;
    Linkable: true;
    Data: VideoData;
    Storage: VideoStorage;
    Children: [CaptionSchema] | undefined;
}>;
