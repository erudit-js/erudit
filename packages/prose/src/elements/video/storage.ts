import { projectRelFilePath } from '../../shared/filePath.js';
import type { VideoStorage } from './core.js';

export function createVideoStorage(
  projectAbsPath: string,
  projectBaseUrl: string,
  videoAbsoluteSrc: string,
): VideoStorage {
  const resolvedSrc =
    projectBaseUrl +
    'file/' +
    projectRelFilePath(projectAbsPath, videoAbsoluteSrc);

  return {
    resolvedSrc,
  };
}
