import { EruditProseError } from '../error.js';

function normalizeForCompare(p: string): string {
  return p
    .replace(/\\/g, '/')
    .replace(/^([A-Za-z]):/, (_, d: string) => d.toLowerCase() + ':')
    .replace(/\/+$/g, '');
}

function isAbsolutePath(p: string): boolean {
  // After normalization separators are '/', so check for:
  // - Windows drive-root: C:/...
  // - POSIX root: /...
  // - UNC root: //server/share/...
  return /^[A-Za-z]:\//.test(p) || p.startsWith('/') || p.startsWith('//');
}

function hasParentTraversal(relPath: string): boolean {
  return relPath.split('/').some((segment) => segment === '..');
}

/**
 * Checks that the given absolute file path is within the given absolute project path.
 * Returns the file path relative to the project path.
 */
export function projectRelFilePath(
  projectAbsPath: string,
  fileAbsPath: string,
): string {
  const project = normalizeForCompare(projectAbsPath);
  const file = normalizeForCompare(fileAbsPath);

  if (isAbsolutePath(file)) {
    const projectPrefix = project + '/';
    if (!file.startsWith(projectPrefix)) {
      throw new EruditProseError(
        `File "${fileAbsPath}" is outside of project "${projectAbsPath}"`,
      );
    }

    const rel = file.slice(projectPrefix.length);
    if (!rel || hasParentTraversal(rel)) {
      throw new EruditProseError(
        `File "${fileAbsPath}" is outside of project "${projectAbsPath}"`,
      );
    }

    return rel;
  }

  const rel = file.replace(/^\.\/+/, '').replace(/^\/+/, '');
  if (!rel || hasParentTraversal(rel)) {
    throw new EruditProseError(
      `File "${fileAbsPath}" is outside of project "${projectAbsPath}"`,
    );
  }
  return rel;
}
