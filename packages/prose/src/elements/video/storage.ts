import { projectRelFilePath } from '../../shared/core/filePath.js';
import type { VideoStorage } from './core.js';

export function createVideoStorage(
    projectAbsPath: string,
    videoAbsoluteSrc: string,
): VideoStorage {
    const resolvedSrc =
        'file/' + projectRelFilePath(projectAbsPath, videoAbsoluteSrc);

    return {
        resolvedSrc,
    };
}
