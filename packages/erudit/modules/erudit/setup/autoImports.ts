import { writeFileSync } from 'node:fs';
import type { Nuxt } from 'nuxt/schema';
import { addTemplate, findPath } from 'nuxt/kit';
import { sn } from 'unslash';
import type { EruditConfig } from '@erudit-js/core/eruditConfig/config';

import { PROJECT_PATH } from '../env';
import { moduleLogger } from '../logger';
import { printGrayNamesTable } from './namesTable';

interface ResolvedAutoImport {
  /** Config path as written by the user (e.g. './my-globals') */
  configPath: string;
  /** Absolute resolved path to the source file */
  absPath: string;
  /** #project/ relative path for TypeScript type declarations */
  projectRelativePath: string;
  /** Named export identifiers discovered from the file */
  exportNames: string[];
}

export async function setupAutoImports(nuxt: Nuxt, eruditConfig: EruditConfig) {
  const autoImportPaths = eruditConfig.autoImports ?? [];

  if (autoImportPaths.length === 0) {
    createEmptyTemplate(nuxt);
    return;
  }

  const resolved: ResolvedAutoImport[] = [];

  for (const configPath of autoImportPaths) {
    const absPath = await findPath(configPath, {
      cwd: PROJECT_PATH,
      extensions: ['.ts', '.js'],
    });

    if (!absPath) {
      throw new Error(`[autoImports] Failed to resolve path "${configPath}"!`);
    }

    // Discover named exports by dynamically importing the file
    const mod = await import(absPath);
    const exportNames = Object.keys(mod).filter((key) => key !== 'default');

    if (exportNames.length === 0) {
      moduleLogger.warn(
        `[autoImports] File "${configPath}" has no named exports — skipping.`,
      );
      continue;
    }

    // Compute #project/ relative path for TypeScript type declarations
    const normalizedAbsPath = absPath.replace(/\\/g, '/');
    const normalizedProjectPath = PROJECT_PATH.replace(/\\/g, '/');
    const projectRelativePath = normalizedAbsPath
      .replace(normalizedProjectPath + '/', '')
      .replace(/\.(ts|js)$/, '');

    resolved.push({
      configPath,
      absPath: normalizedAbsPath,
      projectRelativePath,
      exportNames,
    });
  }

  const allExportNames = resolved.flatMap((r) => r.exportNames);

  createTemplate(nuxt, resolved, allExportNames);
  createTypeDeclarations(resolved);

  moduleLogger.success(
    `Registered ${allExportNames.length} auto-import(s) from ${resolved.length} file(s)!`,
  );

  printGrayNamesTable(allExportNames);
}

function createEmptyTemplate(nuxt: Nuxt) {
  addTemplate({
    write: true,
    filename: '#erudit/autoImports.ts',
    getContents: () =>
      `export const autoImportNames = new Set<string>();\nexport function registerAutoImportGlobals() { (globalThis as any).ERUDIT_GLOBAL = (globalThis as any).ERUDIT_GLOBAL || {}; }\n`,
  });

  const alias = (nuxt.options.alias ||= {});
  alias['#erudit/autoImports'] =
    nuxt.options.buildDir + '/#erudit/autoImports.ts';
}

function createTemplate(
  nuxt: Nuxt,
  resolved: ResolvedAutoImport[],
  allExportNames: string[],
) {
  const importStatements = resolved
    .map((r) => {
      const names = r.exportNames.join(', ');
      const importPath = r.absPath.replace(/\.(ts|js)$/, '');
      return `import { ${names} } from '${importPath}';`;
    })
    .join('\n');

  const template =
    `
${importStatements}

export const autoImportNames = new Set<string>(${JSON.stringify(allExportNames)});

export function registerAutoImportGlobals() {
  (globalThis as any).ERUDIT_GLOBAL = (globalThis as any).ERUDIT_GLOBAL || {};
  Object.assign((globalThis as any).ERUDIT_GLOBAL, {
    ${allExportNames.join(',\n    ')}
  });
}
`.trim() + '\n';

  addTemplate({
    write: true,
    filename: '#erudit/autoImports.ts',
    getContents: () => template,
  });

  const alias = (nuxt.options.alias ||= {});
  alias['#erudit/autoImports'] =
    nuxt.options.buildDir + '/#erudit/autoImports.ts';
}

function createTypeDeclarations(resolved: ResolvedAutoImport[]) {
  let dts = 'export {}\n\ndeclare global {\n';

  for (const r of resolved) {
    for (const name of r.exportNames) {
      dts += `    const ${name}: typeof import('#project/${r.projectRelativePath}')['${name}']\n`;
    }
  }

  dts += '}\n';

  writeFileSync(sn(PROJECT_PATH, '.erudit/types/autoImports.d.ts'), dts);
}
