import { readFileSync, writeFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

// Configuration
const ELEMENTS_DIR = './src/elements';
const PACKAGE_JSON_PATH = './package.json';

async function main() {
    console.log('🔨 Building @erudit-js/bitran-elements...');

    // Read current package.json
    const packageJson = JSON.parse(readFileSync(PACKAGE_JSON_PATH, 'utf-8'));

    // Get all element directories
    const elementDirs = getElementDirectories(ELEMENTS_DIR);
    console.log(`📁 Found ${elementDirs.length} element directories`);

    // Generate exports and typesVersions
    const { exports, typesVersions } = generatePackageEntries(elementDirs);

    // Add base exports
    exports['.'] = {
        types: './dist/index.d.ts',
        import: './dist/index.mjs',
        require: './dist/index.mjs',
    };

    exports['./defaultServer'] = {
        types: './dist/defaultServer.d.ts',
        import: './dist/defaultServer.mjs',
        require: './dist/defaultServer.mjs',
    };

    exports['./defaultApp'] = {
        types: './dist/defaultApp.d.ts',
        import: './dist/defaultApp.mjs',
        require: './dist/defaultApp.mjs',
    };

    // Update package.json
    packageJson.exports = exports;
    packageJson.typesVersions = { '*': typesVersions };

    // Write updated package.json
    writeFileSync(
        PACKAGE_JSON_PATH,
        JSON.stringify(packageJson, null, 4),
        'utf-8',
    );

    console.log('✅ Updated package.json exports and typesVersions');
}

function getElementDirectories(baseDir: string): string[] {
    const elementDirs: string[] = [];

    try {
        const entries = readdirSync(baseDir);

        for (const entry of entries) {
            const fullPath = join(baseDir, entry);
            if (statSync(fullPath).isDirectory()) {
                elementDirs.push(entry);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${baseDir}:`, error);
    }

    return elementDirs;
}

function generatePackageEntries(elementDirs: string[]) {
    const exports: Record<string, any> = {};
    const typesVersions: Record<string, string[]> = {};

    for (const dir of elementDirs) {
        const exportPath = `./${dir}/*`;
        const distPath = `./dist/elements/${dir}/*`;

        exports[exportPath] = {
            types: `${distPath}.d.ts`,
            import: `${distPath}.mjs`,
            require: `${distPath}.mjs`,
        };

        typesVersions[`${dir}/*`] = [`${distPath}.d.ts`];
    }

    return { exports, typesVersions };
}

main().catch((err) => {
    console.error('Error during build:', err);
    process.exit(1);
});
