import type { EruditMode } from '../mode.js';

export interface LastmodProviderContext {
  /** Content item full ID, e.g. `"test/my-topic"`. */
  fullId: string;
  /** Current erudit mode. */
  mode: EruditMode;
  /** Absolute path to the project root directory. */
  projectPath: string;
}

/**
 * Custom lastmod provider function.
 * Called for each content item during build.
 * Return a `Date` for the item's last modification time,
 * or `undefined` to skip.
 */
export type LastmodProvider = (
  context: LastmodProviderContext,
) => Date | undefined | Promise<Date | undefined>;

export interface EruditLastmodBase {
  /** Whether lastmod collection is enabled. @default true */
  enabled?: boolean;
}

export interface EruditLastmodGit extends EruditLastmodBase {
  type: 'git';
}

export interface EruditLastmodCustom extends EruditLastmodBase {
  type: 'custom';
  /**
   * Path to a file (relative to project root) whose default export
   * is a {@link LastmodProvider} function.
   * Resolved the same way as `problemChecks` and `elements`.
   *
   * @example './my-lastmod'
   */
  scriptPath: string;
}

export type EruditLastmod = EruditLastmodGit | EruditLastmodCustom;
