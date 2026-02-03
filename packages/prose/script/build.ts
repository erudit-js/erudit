import { rmSync, existsSync, mkdirSync, copyFileSync } from 'node:fs';
import { dirname } from 'node:path';
import { execSync } from 'node:child_process';
import { globSync } from 'glob';

import { transpileFile } from './transpileFile';

/**
 * Determines if a file should be copied as-is (not transpiled)
 */
function shouldCopyAsIs(filePath: string): boolean {
  const endings = ['_global.ts', '_global.d.ts'];
  return endings.some((ending) => filePath.endsWith(ending));
}

/**
 * Converts a source path to its corresponding dist path
 */
function getDistPath(srcPath: string): string {
  return srcPath.replace(/^src[\\/]/, 'dist/').replace(/\\/g, '/');
}

/**
 * Ensures directory exists, creating it recursively if needed
 */
function ensureDirectoryExists(filePath: string): void {
  const dir = dirname(filePath);
  if (!existsSync(dir)) {
    mkdirSync(dir, { recursive: true });
  }
}

// Clean previous build output (dist directory)
if (existsSync('dist')) {
  rmSync('dist', { recursive: true, force: true });
  console.log('🧹 Cleared dist directory');
}

// Find all source files
const allFiles = globSync('src/**/*', { nodir: true });

// Separate files to copy as-is vs transpile
const filesToCopy = allFiles.filter(shouldCopyAsIs);
const filesToTranspile = allFiles.filter((file) => !shouldCopyAsIs(file));

console.log(
  `📦 Found ${allFiles.length} files (${filesToTranspile.length} to transpile, ${filesToCopy.length} to copy)`,
);

let transpileCount = 0;
let copyCount = 0;

// Transpile regular files
for (const file of filesToTranspile) {
  try {
    await transpileFile(file);
    transpileCount++;
  } catch (error) {
    console.error(`❌ Failed to transpile ${file}:`, error);
    throw error;
  }
}

// Copy files as-is
for (const file of filesToCopy) {
  try {
    const destPath = getDistPath(file);
    ensureDirectoryExists(destPath);
    copyFileSync(file, destPath);
    copyCount++;
  } catch (error) {
    console.error(`❌ Failed to copy ${file}:`, error);
    throw error;
  }
}

console.log(`✅ Transpiled ${transpileCount} files`);
console.log(`✅ Copied ${copyCount} files`);
console.log('📝 Generating type declarations via bun tsc...');
execSync('bun tsc --project ./tsconfig.src.json', { stdio: 'inherit' });
console.log('✅ Declarations updated');
