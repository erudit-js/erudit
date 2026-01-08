import { readFileSync, writeFileSync } from 'node:fs';

import pkg from './package.json' with { type: 'json' };

const version = pkg.version;

export function insertVersion() {
    const path = './dist/commands/main.js';
    let content = readFileSync(path, 'utf-8');
    content = content.replace('{{ VERSION }}', version);
    writeFileSync(path, content, 'utf-8');
}

insertVersion();
