import * as fs from 'node:fs';
import * as path from 'node:path';
import { glob } from 'glob';

// Define the package.json dependency sections we want to process
const DEP_KEYS = [
    'dependencies',
    'devDependencies',
    'peerDependencies',
    'optionalDependencies',
];

async function main() {
    // Parse command line arguments
    const args = process.argv.slice(2);
    if (args.length !== 1) {
        console.error('Usage: bun scripts/bitran.ts <link|version>');
        process.exit(1);
    }

    const mode = args[0];
    const isLink = mode === 'link';
    const version = isLink ? undefined : mode;

    console.log(
        `Processing @bitran-js/* dependencies to ${isLink ? 'use link protocol' : `set version ${version}`}`,
    );

    // Find the project root (where the packages directory is)
    const projectRoot = path.resolve(process.cwd());
    const packagesDir = path.join(projectRoot, 'packages');

    // Verify the packages directory exists
    if (!fs.existsSync(packagesDir)) {
        console.error(`Packages directory not found: ${packagesDir}`);
        process.exit(1);
    }

    // Find all package.json files in packages directory
    const packageJsonFiles = await glob('**/package.json', {
        cwd: packagesDir,
        absolute: true,
    });

    if (packageJsonFiles.length === 0) {
        console.log('No package.json files found in the packages directory');
        return;
    }

    for (const packageJsonPath of packageJsonFiles) {
        await processPackageJson(packageJsonPath, isLink, version);
        console.log();
    }

    console.log('Done!');
}

function processPackageJson(
    filePath: string,
    isLink: boolean,
    version: string | undefined,
) {
    console.log(`Processing ${filePath}...`);

    try {
        // Read and parse package.json
        const content = fs.readFileSync(filePath, 'utf-8');
        const packageJson = JSON.parse(content);
        let modified = false;

        // Process each dependency section
        for (const depType of DEP_KEYS) {
            if (!packageJson[depType]) continue;

            const dependencies = packageJson[depType];

            // Update @bitran-js/* dependencies
            for (const depName of Object.keys(dependencies)) {
                if (depName.startsWith('@bitran-js/')) {
                    const oldValue = dependencies[depName];

                    if (isLink) {
                        // For link mode, replace with "link:@package-name"
                        dependencies[depName] = `link:${depName}`;
                    } else {
                        // For version mode, set the specified version
                        dependencies[depName] = version;
                    }

                    modified = true;
                    console.log(
                        `  ${depName}: ${oldValue} -> ${dependencies[depName]}`,
                    );
                }
            }
        }

        if (modified) {
            // Write updated package.json back to file
            fs.writeFileSync(
                filePath,
                JSON.stringify(packageJson, null, 4) + '\n',
                'utf-8',
            );
            console.log(`Updated ${filePath}`);
        } else {
            console.log(`No changes needed for ${filePath}`);
        }
    } catch (error) {
        console.error(`Error processing ${filePath}:`, error);
    }
}

main().catch((error) => {
    console.error('Error:', error);
    process.exit(1);
});
