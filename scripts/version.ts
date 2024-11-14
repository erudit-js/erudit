import { readFile, writeFile, readdir, stat } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';

async function findPackageJsonFiles(directory: string): Promise<string[]> {
    const items = await readdir(directory);
    const files: string[] = [];

    for (const item of items) {
        const itemPath = path.join(directory, item);
        const stats = await stat(itemPath);

        if (stats.isDirectory()) {
            if (existsSync(path.join(itemPath, 'package.json'))) {
                files.push(path.join(itemPath, 'package.json'));
            }
        }
    }

    return files;
}

async function updatePackageVersions(
    packagesDir: string,
    newVersion: string,
): Promise<void> {
    try {
        const packageJsonFiles = await findPackageJsonFiles(packagesDir);

        if (packageJsonFiles.length === 0) {
            console.log(
                'No package.json files found in packages subdirectories.',
            );
            return;
        }

        console.log(
            `Updating ${packageJsonFiles.length} packages to version ${newVersion}:`,
        );

        // First, collect all package names to identify workspace packages
        const workspacePackages = new Map<string, string>();
        for (const file of packageJsonFiles) {
            const content = await readFile(file, 'utf8');
            const packageJson = JSON.parse(content) as { name?: string };
            if (packageJson.name) {
                workspacePackages.set(packageJson.name, file);
            }
        }

        // Now update all package.json files
        for (const file of packageJsonFiles) {
            const content = await readFile(file, 'utf8');
            const packageJson = JSON.parse(content) as {
                version: string;
                dependencies?: Record<string, string>;
                devDependencies?: Record<string, string>;
                peerDependencies?: Record<string, string>;
            };
            const oldVersion = packageJson.version;

            packageJson.version = newVersion;

            // Function to update workspace package references
            const updateDependencies = (deps?: Record<string, string>) => {
                if (deps) {
                    for (const dep of Object.keys(deps)) {
                        if (workspacePackages.has(dep)) {
                            deps[dep] = 'workspace:' + newVersion;
                        }
                    }
                }
            };

            updateDependencies(packageJson.dependencies);
            updateDependencies(packageJson.devDependencies);
            updateDependencies(packageJson.peerDependencies);

            await writeFile(
                file,
                JSON.stringify(packageJson, null, 4) + '\n',
                'utf8',
            );

            console.log(
                `- ${path.basename(path.dirname(file))}: ${oldVersion} → ${newVersion}`,
            );
        }

        console.log('\nAll packages updated successfully!');
    } catch (error) {
        console.error('Error updating package versions:', error);
        process.exit(1);
    }
}

function main(): void {
    const newVersion = process.argv[2];

    if (!newVersion) {
        console.error('Error: Version argument is required');
        console.error('Usage: bun scripts/version <version>');
        process.exit(1);
    }

    // Check if version format is valid
    const versionRegex = /^\d+\.\d+\.\d+(-[0-9A-Za-z-.]+)?$/;
    if (!versionRegex.test(newVersion)) {
        console.error(
            'Error: Invalid version format. Please use semver format (e.g., 1.2.3 or 1.2.3-beta.1)',
        );
        process.exit(1);
    }

    const packagesDir = path.resolve(__dirname, '..', 'packages');
    updatePackageVersions(packagesDir, newVersion);
}

main();
