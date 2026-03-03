import type { Nuxt } from 'nuxt/schema';
import { addTemplate } from 'nuxt/kit';

import type { ResolvedProblemCheck } from './shared';
import { toJsSlug } from '../toJsSlug';

export function createTemplate(
  nuxt: Nuxt,
  problemChecks: ResolvedProblemCheck[],
) {
  const importName = (i: number, name: string) =>
    `check_${i}_${toJsSlug(name)}`;

  const template = `
import type { ProblemCheckers } from '@erudit-js/core/problemCheck';

${problemChecks
  .map(
    (check, i) =>
      `import ${importName(i, check.name)} from '${check.absPath.replace(/\.(ts|js)$/, '')}';`,
  )
  .join('\n')}

export const problemCheckers: ProblemCheckers = {
  ${problemChecks.map((check, i) => `${JSON.stringify(check.name)}: ${importName(i, check.name)},`).join('\n  ')}
}
  `.trim();

  addTemplate({
    write: true,
    filename: '#erudit/checks.ts',
    getContents: () => template,
  });

  const alias = (nuxt.options.alias ||= {});
  alias['#erudit/checks'] = nuxt.options.buildDir + '/#erudit/checks.ts';
}
