import { transform } from 'oxc-transform';
import { dirname, extname, join, resolve } from 'node:path';
import {
    mkdirSync,
    writeFileSync,
    readFileSync,
    copyFileSync,
    existsSync,
    statSync,
} from 'node:fs';

function ensureMjsExtensions(code: string, fileDir: string): string {
    const hasIndexFile = (dir: string) => {
        const candidates = [
            'index.ts',
            'index.tsx',
            'index.js',
            'index.mjs',
            'index.cjs',
        ];
        try {
            if (!existsSync(dir) || !statSync(dir).isDirectory()) return false;
        } catch {
            return false;
        }
        return candidates.some((f) => existsSync(join(dir, f)));
    };

    const fixPath = (spec: string) => {
        if (!spec.startsWith('.')) return spec; // bare specifier, skip
        // Skip Vite / resource query or hash imports (e.g. ?raw, ?url, #fragment)
        if (/[?#]/.test(spec)) return spec;
        if (/\.(mjs|cjs|json|node)$/i.test(spec)) return spec; // already has acceptable extension
        if (/\.(ts|tsx|js)$/i.test(spec))
            return spec.replace(/\.(ts|tsx|js)$/i, '.mjs');

        // No explicit extension: check for hidden index
        if (!/\.[a-zA-Z0-9]+$/.test(spec)) {
            const specNoSlash = spec.replace(/\/+$/, '');
            const abs = resolve(fileDir, specNoSlash);
            if (hasIndexFile(abs)) {
                return `${specNoSlash}/index.mjs`;
            }
            return spec + '.mjs';
        }

        // If a corresponding source file (e.g. main.global.ts/.tsx/.js) exists, point to .mjs output.
        const absBase = resolve(fileDir, spec);
        for (const ext of ['.ts', '.tsx', '.js']) {
            if (existsSync(absBase + ext)) {
                return spec + '.mjs';
            }
        }
        return spec;
    };

    // Static import/export ... from '...'
    code = code.replace(
        /\b(import|export)\b([\s\r\n]+(?:type\s+)?)?(?:[^'";()]*?)from\s+(['"])([^'"]+)\3/g,
        (full, kw, mid, quote, spec) => full.replace(spec, fixPath(spec)),
    );

    // Bare side-effect imports: import '...';
    code = code.replace(
        /\bimport\s+(['"])([^'"]+)\1\s*;?/g,
        (full, quote, spec) => full.replace(spec, fixPath(spec)),
    );

    // Dynamic import('...')
    code = code.replace(
        /import\s*\(\s*(['"])([^'"]+)\1\s*\)/g,
        (full, quote, spec) => `import(${quote}${fixPath(spec)}${quote})`,
    );
    return code;
}

const SRC_DIR = 'src';
const OUT_DIR = 'dist';

/**
 * Build (transform or copy) a single file, mapping its path from srcRoot to outRoot.
 * Returns object with produced output paths.
 */
export function transpileFile(
    file: string,
    srcRoot: string = SRC_DIR,
    outRoot: string = OUT_DIR,
): { jsOutPath?: string; assetOutPath?: string } {
    const ext = extname(file).toLowerCase();

    let relPath: string;
    const normSrc = srcRoot.replace(/[/\\]+$/, '');
    if (
        file === normSrc ||
        file.startsWith(normSrc + '/') ||
        file.startsWith(normSrc + '\\')
    ) {
        relPath = file.slice(normSrc.length).replace(/^[/\\]/, '');
    } else {
        relPath = file;
    }

    if (ext === '.ts' || ext === '.tsx') {
        const fileContents = readFileSync(file, 'utf-8');
        const result = transform('file', fileContents, {
            lang: 'ts',
            target: 'esnext',
            typescript: {
                onlyRemoveTypeImports: true,
                allowNamespaces: true,
            },
        });

        const jsOutPath = `${outRoot}/${relPath.replace(/\.(ts|tsx)$/, '.mjs')}`;

        mkdirSync(dirname(jsOutPath), { recursive: true });
        let jsCode = result.code;
        jsCode = ensureMjsExtensions(jsCode, dirname(file));
        writeFileSync(jsOutPath, jsCode);

        return { jsOutPath };
    } else {
        const assetOutPath = `${outRoot}/${relPath}`;
        mkdirSync(dirname(assetOutPath), { recursive: true });
        copyFileSync(file, assetOutPath);
        return { assetOutPath };
    }
}
