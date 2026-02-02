/**
 * Usage:
 * bun scripts/link.ts
 * bun scripts/link.ts --unset
 */

import fs from 'node:fs';
import path from 'node:path';
import { execSync } from 'node:child_process';

// Parse command line arguments
const args = process.argv.slice(2);
const isUnlink = args.includes('--unset');
const command = isUnlink ? 'unlink' : 'link';

// Get the root directory of the project
const rootDir = process.cwd();
const packagesDir = path.join(rootDir, 'packages');

// Ensure the packages directory exists
if (!fs.existsSync(packagesDir)) {
  console.error(`Error: Directory "${packagesDir}" not found.`);
  process.exit(1);
}

// Get all directories within the packages directory
const packageDirs = fs
  .readdirSync(packagesDir)
  .filter((item) => fs.statSync(path.join(packagesDir, item)).isDirectory());

if (packageDirs.length === 0) {
  console.log('No packages found in the "packages" directory.');
  process.exit(0);
}

console.log(`${isUnlink ? 'Unlinking' : 'Linking'} all packages...`);

// Execute bun link/unlink for each package
for (const dir of packageDirs) {
  const packagePath = path.join(packagesDir, dir);

  // Check if the directory contains a package.json file
  const packageJsonPath = path.join(packagePath, 'package.json');
  if (!fs.existsSync(packageJsonPath)) {
    console.log(`Skipping ${dir} (no package.json found)`);
    continue;
  }

  try {
    console.log(`${command}ing ${dir}...`);
    execSync(`cd "${packagePath}" && bun ${command}`, { stdio: 'inherit' });
    console.log(`Successfully ${command}ed ${dir}`);
  } catch (error: any) {
    console.error(`Error ${command}ing ${dir}:`, error.message);
  }
}

console.log(`All packages have been ${isUnlink ? 'unlinked' : 'linked'}.`);
