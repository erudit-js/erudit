import { projectRelFilePath } from '../../shared/filePath.js';
import type { CalloutStorage } from './core.js';

export function createCalloutStorage(
    projectAbsPath: string,
    projectBaseUrl: string,
    calloutAbsoluteIconSrc: string,
): CalloutStorage {
    const resolvedIconSrc =
        projectBaseUrl +
        'file/' +
        projectRelFilePath(projectAbsPath, calloutAbsoluteIconSrc);

    return {
        resolvedIconSrc,
    };
}
