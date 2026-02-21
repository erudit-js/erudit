import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { sn } from 'unslash';

import type { ElementData } from './shared';
import { PROJECT_PATH } from '../../env';

export function createElementGlobalTypes(elementsData: ElementData[]) {
  for (const elementData of elementsData) {
    // Collect tag names from core element
    const allCoreTagNames = new Set<string>();
    for (const coreElement of elementData.coreElements) {
      for (const tagName of Object.keys(coreElement.tags)) {
        allCoreTagNames.add(tagName);
      }
    }

    // Parse existing _global.d.ts if it exists
    let imports: string[] = [];
    let tags: Record<string, string> = {};
    let other: Record<
      string,
      { jsdoc: string; definition: string; kind: 'type' | 'const' }
    > = {};

    const globalDtsPath = elementData.absDirectory + '/_global.d.ts';
    if (existsSync(globalDtsPath)) {
      const globalDts = readFileSync(globalDtsPath, 'utf-8');
      const parsed = parseGlobalDts(globalDts);
      imports = parsed.imports;
      tags = parsed.tags;
      other = parsed.other;
    }

    // Add missing tags from core element
    for (const tagName of allCoreTagNames) {
      if (!(tagName in tags)) {
        tags[tagName] = '';
      }
    }

    // Skip if there's nothing to generate
    if (Object.keys(tags).length === 0 && Object.keys(other).length === 0) {
      continue;
    }

    // Transform import paths from relative to absolute
    const resolvedImports = imports.map((importLine) => {
      return importLine.replace(
        /from\s+['"](\.[^'"]+)['"]/,
        (_match: string, relativePath: string) => {
          const absolutePath = resolve(
            elementData.absDirectory,
            relativePath,
          ).replace(/\\/g, '/');
          return `from '${absolutePath}'`;
        },
      );
    });

    // Create typeof imports for tags that exist in element's core elements
    const tagDefinitions = Object.entries(tags).map(([tagName, jsdoc]) => {
      // Find which core element contains this tag
      let tagDefinition = "'_tag_'";
      for (let i = 0; i < elementData.coreElements.length; i++) {
        const coreElement = elementData.coreElements[i]!;
        if (coreElement.tags[tagName] !== undefined) {
          // If there are multiple schemas, include the index
          if (elementData.coreElements.length > 1) {
            tagDefinition = `typeof import('${elementData.absCorePath}')['default'][${i}]['tags']['${coreElement.tags[tagName]}']`;
          } else {
            tagDefinition = `typeof import('${elementData.absCorePath}')['default']['tags']['${coreElement.tags[tagName]}']`;
          }
          break;
        }
      }

      const indentedJsdoc = indentJsDoc(jsdoc);

      return indentedJsdoc
        ? `${indentedJsdoc}\n  const ${tagName}: ${tagDefinition};`
        : `  const ${tagName}: ${tagDefinition};`;
    });

    const finalDts = `
${resolvedImports.join('\n')}

declare global {
${tagDefinitions.join('\n')}

${Object.entries(other)
  .map(([typeName, { jsdoc, definition, kind }]) => {
    const indentedJsdoc = indentJsDoc(jsdoc);
    const declaration =
      kind === 'type'
        ? `type ${typeName} = ${definition};`
        : `const ${typeName}: ${definition};`;
    return indentedJsdoc
      ? `${indentedJsdoc}\n  ${declaration}`
      : `  ${declaration}`;
  })
  .join('\n')}
}

export {};
        `.trim();

    mkdirSync(sn(PROJECT_PATH, `.erudit/types/elements/${elementData.name}`), {
      recursive: true,
    });

    writeFileSync(
      sn(
        PROJECT_PATH,
        `.erudit/types/elements/${elementData.name}/global.d.ts`,
      ),
      finalDts,
      'utf-8',
    );
  }

  //
}

function parseGlobalDts(dts: string): {
  imports: string[];
  tags: Record<string, string>;
  other: Record<
    string,
    { jsdoc: string; definition: string; kind: 'type' | 'const' }
  >;
} {
  const imports: string[] = [];
  const tags: Record<string, string> = {};
  const other: Record<
    string,
    { jsdoc: string; definition: string; kind: 'type' | 'const' }
  > = {};

  const lines = dts.split('\n');
  let currentJsDoc = '';
  let inJsDoc = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]!.trim();

    // Collect imports as-is (will be transformed later)
    if (line.startsWith('import ')) {
      imports.push(line);
      continue;
    }

    // Track JSDoc comments
    if (line.startsWith('/**')) {
      inJsDoc = true;
      currentJsDoc = line + '\n';
      continue;
    }

    if (inJsDoc) {
      currentJsDoc += lines[i] + '\n';
      if (line.includes('*/')) {
        inJsDoc = false;
      }
      continue;
    }

    // Parse export type definitions
    if (line.startsWith('export type ')) {
      const typeMatch = line.match(/^export\s+type\s+(\w+)\s*=\s*(.+);?$/);
      if (typeMatch) {
        const [, typeName, typeDefinition] = typeMatch;
        const normalizedDefinition = typeDefinition!.replace(/;$/, '').trim();

        // Check if it's a tag
        if (
          normalizedDefinition === "'_tag_'" ||
          normalizedDefinition === '"_tag_"'
        ) {
          tags[typeName!] = currentJsDoc.trim();
          // Don't reset JSDoc for tags - let it apply to next consecutive tags
        } else {
          other[typeName!] = {
            jsdoc: currentJsDoc.trim(),
            definition: normalizedDefinition,
            kind: 'type',
          };
          currentJsDoc = '';
        }
      }
      continue;
    }

    // Parse export const definitions
    if (line.startsWith('export const ')) {
      const constMatch = line.match(/^export\s+const\s+(\w+)\s*[=:]\s*(.+);?$/);
      if (constMatch) {
        const [, constName, constType] = constMatch;
        const normalizedType = constType!.replace(/;$/, '').trim();

        // Check if it's a tag
        if (normalizedType === "'_tag_'" || normalizedType === '"_tag_"') {
          tags[constName!] = currentJsDoc.trim();
          // Don't reset JSDoc for tags - let it apply to next consecutive tags
        } else {
          other[constName!] = {
            jsdoc: currentJsDoc.trim(),
            definition: normalizedType,
            kind: 'const',
          };
          currentJsDoc = '';
        }
      }
      continue;
    }

    // Parse legacy type definitions (for backwards compatibility)
    if (line.startsWith('type ')) {
      const typeMatch = line.match(/^type\s+(\w+)\s*=\s*(.+);?$/);
      if (typeMatch) {
        const [, typeName, typeDefinition] = typeMatch;
        const normalizedDefinition = typeDefinition!.replace(/;$/, '').trim();

        // Check if it's a tag
        if (
          normalizedDefinition === "'_tag_'" ||
          normalizedDefinition === '"_tag_"'
        ) {
          tags[typeName!] = currentJsDoc.trim();
          // Don't reset JSDoc for tags - let it apply to next consecutive tags
        } else {
          other[typeName!] = {
            jsdoc: currentJsDoc.trim(),
            definition: normalizedDefinition,
            kind: 'type',
          };
          currentJsDoc = '';
        }
      }
      continue;
    }

    // Reset JSDoc on blank lines or comments
    if (line.startsWith('//') || line === '') {
      currentJsDoc = '';
      continue;
    }
  }

  return { imports, tags, other };
}

function indentJsDoc(jsdoc: string, indent: string = '  '): string {
  if (!jsdoc) return '';
  return jsdoc
    .split('\n')
    .map((line) => indent + line)
    .join('\n');
}
