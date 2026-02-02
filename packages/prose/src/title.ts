import type { EruditProcessTagArgs } from './tag.js';

export type ObjRawElementTitle = {
  /**
   * Shared element title to be used as fallback value (for example, in snippet or TOC).
   */
  title?: string;
};

export function finalizeTitle(
  processTagArgs: EruditProcessTagArgs,
): string | undefined {
  const elementTitle = processTagArgs.element.title?.trim();
  const propSnippetTitle = processTagArgs.props.snippet?.title?.trim();
  const propTocTitle =
    typeof processTagArgs.props.toc === 'string'
      ? processTagArgs.props.toc.trim()
      : undefined;

  return elementTitle || propSnippetTitle || propTocTitle || undefined;
}
