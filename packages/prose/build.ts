import { globSync } from 'glob';
import { rmSync, existsSync } from 'node:fs';
import { transpileFile } from './transpileFile';

// Clean previous build output (dist directory)
if (existsSync('dist')) {
    rmSync('dist', { recursive: true, force: true });
    console.log('🧹 Cleared dist directory');
}

// Find all source files (we let transpileFile decide how to handle each)
const srcFiles = globSync('src/**/*', { nodir: true });

let count = 0;
for (const file of srcFiles) {
    transpileFile(file);
    count++;
}

console.log(`✅ Built ${count} files`);
