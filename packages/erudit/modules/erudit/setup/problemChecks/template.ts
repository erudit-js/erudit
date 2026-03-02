import type { Nuxt } from 'nuxt/schema';
import { addTemplate } from 'nuxt/kit';

import type { ResolvedProblemCheck } from './shared';

export function createTemplate(
  nuxt: Nuxt,
  problemChecks: ResolvedProblemCheck[],
) {
  const template = `
import type { ProblemCheckers } from '@erudit-js/core/problemCheck';

${problemChecks
  .map(
    (check) =>
      `import ${check.name} from '${check.absPath.replace(/\.(ts|js)$/, '')}';`,
  )
  .join('\n')}

export const problemCheckers: ProblemCheckers = {
  ${problemChecks.map((check) => `${check.name},`).join('\n  ')}
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
