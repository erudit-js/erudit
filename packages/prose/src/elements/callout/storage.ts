import { projectRelFilePath } from '../../shared/filePath.js';
import type { CalloutStorage } from './core.js';

const videoExtensions = ['mp4', 'webm', 'ogg'];

export function createCalloutStorage(
  projectAbsPath: string,
  projectBaseUrl: string,
  calloutAbsoluteIconSrc: string,
): CalloutStorage {
  const resolvedIconSrc =
    projectBaseUrl +
    'file/' +
    projectRelFilePath(projectAbsPath, calloutAbsoluteIconSrc);

  const ext = calloutAbsoluteIconSrc.split('.').pop()?.toLowerCase() ?? '';
  const videoIcon = videoExtensions.includes(ext);

  return {
    resolvedIconSrc,
    videoIcon,
  };
}
