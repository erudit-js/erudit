#!/usr/bin/env node

import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { runCli } from '@erudit-js/cli/cli';

const absEruditPath = resolve(
    dirname(fileURLToPath(import.meta.url)),
    '..',
).replace(/\\/g, '/');

runCli(absEruditPath);
