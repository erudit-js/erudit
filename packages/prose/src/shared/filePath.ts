import { ProseError } from '@jsprose/core';

/**
 * Checks that the given absolute file path is within the given absolute project path.
 * Returns the file path relative to the project path.
 */
export function projectRelFilePath(
  projectAbsPath: string,
  fileAbsPath: string,
): string {
  if (!fileAbsPath.startsWith(projectAbsPath)) {
    throw new ProseError(
      `File "${fileAbsPath}" is outside of project "${projectAbsPath}"`,
    );
  }

  return fileAbsPath.slice(projectAbsPath.length + 1);
}
