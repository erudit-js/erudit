export const imageExtensions = [
    'png',
    'jpg',
    'jpeg',
    'gif',
    'webp',
    'avif',
] as const;

export const videoExtensions = ['mp4', 'webm', 'ogg'] as const;

export type FileType = 'image' | 'video' | 'unknown';

export function detectFileType(filename: string): FileType {
    const ext = filename.split('.').pop()?.toLowerCase();

    if (ext) {
        if (imageExtensions.includes(ext as (typeof imageExtensions)[number])) {
            return 'image';
        }

        if (videoExtensions.includes(ext as (typeof videoExtensions)[number])) {
            return 'video';
        }
    }

    return 'unknown';
}

export function detectStrictFileType<T extends FileType>(
    filename: string,
    ...types: T[]
): T {
    const fileType = detectFileType(filename);
    if (!types.includes(fileType as T)) {
        throw new Error(
            `Invalid file type "${fileType}" of file "${filename}"! Expected one of: ${types.join(', ')}.`,
        );
    }
    return fileType as T;
}
