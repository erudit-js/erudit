import { projectRelFilePath } from '../../shared/filePath.js';
import type { CalloutStorage } from './core.js';

export function createCalloutStorage(
    projectAbsPath: string,
    calloutAbsoluteIconSrc: string,
): CalloutStorage {
    const resolvedIconSrc =
        'file/' + projectRelFilePath(projectAbsPath, calloutAbsoluteIconSrc);

    return {
        resolvedIconSrc,
    };
}
