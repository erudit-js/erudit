import * as fs from 'node:fs/promises';
import * as path from 'node:path';
import { existsSync } from 'node:fs';
import { resolvePaths } from '@erudit-js/cog/kit';

//
// TODO: Remove this when https://github.com/nuxt/nuxt/issues/30978 is fixed!
//

export async function alias2Relative(baseDir: string, toReplaceDir: string) {
    baseDir = resolvePaths(baseDir);
    toReplaceDir = resolvePaths(toReplaceDir);

    // Check if directories exist
    if (!existsSync(baseDir)) {
        console.log(`Base directory ${baseDir} does not exist. Skipping...`);
        return;
    }

    if (!existsSync(toReplaceDir)) {
        console.log(
            `Target directory ${toReplaceDir} does not exist. Skipping...`,
        );
        return;
    }

    const ALIASES_RESOLVED_FILE = path.join(toReplaceDir, 'ALIASES_RESOLVED');

    // Check if ALIASES_RESOLVED file exists
    if (existsSync(ALIASES_RESOLVED_FILE)) {
        console.log(`Aliases already resolved in ${toReplaceDir}. Skipping...`);
        return;
    }

    const replaceMap = {
        '@erudit': './',
        '@module': './module',
        '@server': './server/plugin',
        '@shared': './shared',
        '@app': './app',
    };

    // Find all files in toReplaceDir recursively
    const allFiles = await findAllFiles(toReplaceDir);

    // Process each file
    for (const filePath of allFiles) {
        await processFile(filePath, baseDir, replaceMap);
    }

    // Create ALIASES_RESOLVED file
    await fs.writeFile(ALIASES_RESOLVED_FILE, new Date().toISOString());
    console.log(`All aliases in ${toReplaceDir} resolved successfully!`);
}

async function findAllFiles(dir: string): Promise<string[]> {
    const results: string[] = [];

    try {
        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const ignore: string[] = [];

            if (entry.isDirectory()) {
                if (!ignore.includes(entry.name)) {
                    results.push(...(await findAllFiles(fullPath)));
                }
            } else if (entry.isFile() && /\.(js|ts|vue)$/.test(entry.name)) {
                results.push(fullPath);
            }
        }
    } catch (error) {
        console.error(`Error reading directory ${dir}:`, error);
    }

    return results;
}

async function processFile(
    filePath: string,
    rootDir: string,
    replaceMap: Record<string, string>,
): Promise<void> {
    try {
        // Read file content
        let content = await fs.readFile(filePath, 'utf8');
        let modified = false;

        // Replace all aliases with relative paths
        for (const [alias, targetBasePath] of Object.entries(replaceMap)) {
            // Match static imports using the alias
            const staticAliasPattern = new RegExp(
                `(import|from)\\s+(['"])${alias}/([^'"]+)(['"])`,
                'g',
            );

            // Match dynamic imports using the alias
            const dynamicAliasPattern = new RegExp(
                `(import\\s*\\()\\s*(['"])${alias}/([^'"]+)(['"])\\s*\\)`,
                'g',
            );

            // Function to calculate and format the relative path
            const calculateRelativePath = (importPath: string) => {
                const currentFileDir = path.dirname(filePath);
                const targetAbsoluteDir = path.join(
                    rootDir,
                    targetBasePath.replace(/^\.\//, ''),
                );
                const targetAbsolutePath = path.join(
                    targetAbsoluteDir,
                    importPath,
                );

                // Calculate relative path
                let relativePath = path.relative(
                    currentFileDir,
                    targetAbsolutePath,
                );

                // Ensure path starts with ./ or ../
                if (!relativePath.startsWith('.')) {
                    relativePath = './' + relativePath;
                }

                // Use forward slashes for consistency
                return relativePath.replace(/\\/g, '/');
            };

            // Process static imports
            content = content.replace(
                staticAliasPattern,
                (match, statement, openQuote, importPath, closeQuote) => {
                    const relativePath = calculateRelativePath(importPath);
                    modified = true;
                    return `${statement} ${openQuote}${relativePath}${closeQuote}`;
                },
            );

            // Process dynamic imports
            content = content.replace(
                dynamicAliasPattern,
                (match, importStatement, openQuote, importPath, closeQuote) => {
                    const relativePath = calculateRelativePath(importPath);
                    modified = true;
                    return `${importStatement}${openQuote}${relativePath}${closeQuote})`;
                },
            );
        }

        // Write back if modified
        if (modified) {
            await fs.writeFile(filePath, content, 'utf8');
            console.log(`Updated aliases in: ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing file ${filePath}:`, error);
    }
}
