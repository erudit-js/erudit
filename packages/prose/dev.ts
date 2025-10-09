import {
    watch,
    readdirSync,
    readFileSync,
    unlinkSync,
    existsSync,
} from 'node:fs';
import { join, relative } from 'node:path';
import { createHash } from 'node:crypto';
import { transpileFile } from './transpileFile';

/**
 * Incremental dev builder:
 *  - Does NOT clean dist
 *  - Transpiles only added/changed TS/TSX files (copies assets)
 *  - Removes output for deleted source files
 *  - Uses content hashing to skip unchanged writes
 */

const SRC_DIR = join(process.cwd(), 'src');
const OUT_DIR = 'dist';
const DEBOUNCE_DELAY = 120;

// path (relative to SRC_DIR) -> content hash
const fileHashes = new Map<string, string>();

// Pending (relative) paths to process
const pending = new Set<string>();
let timer: NodeJS.Timeout | null = null;

const hashOf = (fullPath: string): string | null => {
    try {
        const buf = readFileSync(fullPath);
        return createHash('sha1').update(buf).digest('hex');
    } catch {
        return null; // treat as deleted
    }
};

const scan = (dir: string) => {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const e of entries) {
        const full = join(dir, e.name);
        if (e.isDirectory()) {
            scan(full);
        } else if (e.isFile()) {
            const rel = relative(SRC_DIR, full);
            const h = hashOf(full);
            if (h) fileHashes.set(rel, h);
        }
    }
};

const schedule = (rel: string) => {
    pending.add(rel);
    if (timer) clearTimeout(timer);
    timer = setTimeout(flush, DEBOUNCE_DELAY);
};

const flush = () => {
    const toProcess = Array.from(pending);
    pending.clear();
    if (!toProcess.length) return;
    const changed: string[] = [];
    const deleted: string[] = [];

    for (const rel of toProcess) {
        const full = join(SRC_DIR, rel);
        const newHash = hashOf(full);
        const oldHash = fileHashes.get(rel);
        if (newHash === null) {
            if (oldHash) {
                fileHashes.delete(rel);
                deleted.push(rel);
                // Remove built artifacts (.mjs / .d.ts or asset copy)
                removeOutputs(rel);
            }
            continue;
        }
        if (oldHash === newHash) {
            continue; // unchanged
        }
        fileHashes.set(rel, newHash);
        changed.push(rel);

        buildOne(rel);
    }

    if (changed.length) {
        console.log('🔄 Updated:');
        for (const f of changed) console.log('  •', f);
    }
    if (deleted.length) {
        console.log('🗑️ Deleted:');
        for (const f of deleted) console.log('  •', f);
    }
};

const removeOutputs = (rel: string) => {
    // If source was TS/TSX we produced .mjs and .d.ts, else copied asset
    if (/\.(ts|tsx)$/i.test(rel)) {
        const jsOut = join(OUT_DIR, rel.replace(/\.(ts|tsx)$/, '.mjs'));
        const dtsOut = join(OUT_DIR, rel.replace(/\.(ts|tsx)$/, '.d.ts'));
        for (const p of [jsOut, dtsOut]) {
            if (existsSync(p))
                try {
                    unlinkSync(p);
                } catch {}
        }
    } else {
        const assetOut = join(OUT_DIR, rel);
        if (existsSync(assetOut))
            try {
                unlinkSync(assetOut);
            } catch {}
    }
};

const buildOne = (rel: string) => {
    const full = join(SRC_DIR, rel);
    try {
        transpileFile(full, SRC_DIR, OUT_DIR);
    } catch (e) {
        console.error('❌ Build error for', rel, e);
    }
};

// Initial scan & full build of existing files
console.log('🔍 Initial scan...');
scan(SRC_DIR);
console.log(`📝 Tracking ${fileHashes.size} files`);
console.log('⚙️  Performing initial incremental build...');
for (const rel of fileHashes.keys()) buildOne(rel);
console.log('👀 Ready. Watching for changes...');

// Start watcher
watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
    if (!filename) return;
    const rel = filename.replace(/\\/g, '/');
    schedule(rel);
});
