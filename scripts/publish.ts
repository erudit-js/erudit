import { execSync } from 'node:child_process';
import { readdirSync, readFileSync } from 'node:fs';
import { join } from 'node:path';
import { argv } from 'node:process';

const packagesDir = join(__dirname, '../packages');
const packages = readdirSync(packagesDir);

const orderedPackages = ['cog', 'cli', 'erudit'];
const otherPackages = packages.filter((pkg) => !orderedPackages.includes(pkg));
const allPackages = [...orderedPackages, ...otherPackages];

// Determine tag based on arguments or version
const hasTagArg = argv.includes('--tag');
const explicitTag = hasTagArg ? argv[argv.indexOf('--tag') + 1] : null;

// Function to read package.json
function readPackageJson(pkgPath: string) {
    try {
        const pkgJsonPath = join(pkgPath, 'package.json');
        return JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
    } catch (error) {
        console.error(`Error reading package.json:`, error);
        return null;
    }
}

// Function to check if package has link dependencies
function hasLinkDependencies(pkgJson: any): boolean {
    if (!pkgJson) return false;

    const checkForLinks = (deps: Record<string, string> | undefined) => {
        if (!deps) return false;
        return Object.values(deps).some(
            (dep) => typeof dep === 'string' && dep.startsWith('link:'),
        );
    };

    return (
        checkForLinks(pkgJson.dependencies) ||
        checkForLinks(pkgJson.peerDependencies)
    );
}

// Function to get appropriate tag for a package
function getTagForPackage(pkgJson: any): string {
    if (explicitTag) return explicitTag;

    if (pkgJson && pkgJson.version && pkgJson.version.includes('-dev')) {
        return 'dev';
    }

    return 'latest';
}

let allGood = true;

allPackages.forEach((pkg) => {
    const pkgPath = join(packagesDir, pkg);
    const pkgJson = readPackageJson(pkgPath);

    if (hasLinkDependencies(pkgJson)) {
        console.error(
            `Cannot publish "${pkg}": Package has "link:" dependencies which are not allowed for publishing.`,
        );
        allGood = false;
        return;
    }

    const tag = getTagForPackage(pkgJson);

    try {
        console.log(`Dry run publishing "${pkg}" with tag "${tag}"...`);
        execSync(`bun publish --dry-run --tag ${tag} --access public`, {
            cwd: pkgPath,
            stdio: 'inherit',
        });
        console.log(`"${pkg}" dry run successful.`);
    } catch (error) {
        console.error(`Failed dry run for "${pkg}":`, error);
        allGood = false;
    }
});

if (allGood) {
    allPackages.forEach((pkg) => {
        const pkgPath = join(packagesDir, pkg);
        const pkgJson = readPackageJson(pkgPath);
        const tag = getTagForPackage(pkgJson);

        try {
            console.log(`Publishing "${pkg}" with tag "${tag}"...`);
            execSync(`bun publish --tag ${tag} --access public`, {
                cwd: pkgPath,
                stdio: 'inherit',
            });
            console.log(`"${pkg}" published successfully.`);
        } catch (error) {
            console.error(`Failed to publish "${pkg}":`, error);
        }
    });
} else {
    console.error('Dry run failed for one or more packages. Aborting publish.');
}
