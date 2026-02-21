import type { VideoStorage } from './core.js';

export function createVideoStorage(
  projectAbsPath: string,
  projectBaseUrl: string,
  videoRelSrc: string,
): VideoStorage {
  const resolvedSrc = projectBaseUrl + 'file/' + videoRelSrc;

  return {
    resolvedSrc,
  };
}
