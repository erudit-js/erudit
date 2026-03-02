import type { Nuxt } from 'nuxt/schema';
import { findPath } from 'nuxt/kit';
import type { EruditConfig } from '@erudit-js/core/eruditConfig/config';
import type { ProblemChecker } from '@erudit-js/core/problemCheck';

import type { ResolvedProblemCheck } from './shared';
import { PROJECT_PATH } from '../../env';
import { moduleLogger } from '../../logger';
import { printGrayNamesTable } from '../namesTable';
import { createTemplate } from './template';

export async function setupProblemChecks(
  nuxt: Nuxt,
  eruditConfig: EruditConfig,
) {
  const resolvedProblemChecks: ResolvedProblemCheck[] = [];
  const seenProblemChecks = new Set<string>();

  for (const strProblemCheck of eruditConfig.problemChecks ?? []) {
    const absPath = await findPath(strProblemCheck, {
      cwd: PROJECT_PATH,
      extensions: ['.ts', '.js'],
    });

    if (!absPath) {
      throw new Error(
        `Failed to resolve path for problem check "${strProblemCheck}"!`,
      );
    }

    const defaultExport = (await import(absPath)).default as ProblemChecker;
    const name = defaultExport?.name;

    if (!name) {
      throw new Error(
        `Problem check at "${strProblemCheck}" does not have a name!`,
      );
    }

    if (seenProblemChecks.has(name)) {
      throw new Error(`Duplicate problem check name "${name}" found!`);
    }

    seenProblemChecks.add(name);
    resolvedProblemChecks.push({
      name,
      absPath,
    });
  }

  createTemplate(nuxt, resolvedProblemChecks);

  if (resolvedProblemChecks.length > 0) {
    moduleLogger.success(
      `Registered ${resolvedProblemChecks.length} problem check(s)!`,
    );

    printGrayNamesTable(resolvedProblemChecks.map((c) => c.name));
  }
}
