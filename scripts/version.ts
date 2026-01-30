import { readFile, writeFile, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import chalk from 'chalk';

async function updatePackageVersion(packagePath: string, newVersion: string) {
    const packageJsonPath = join(packagePath, 'package.json');
    try {
        const content = await readFile(packageJsonPath, 'utf8');
        const pkg = JSON.parse(content);
        const oldVersion = pkg.version;
        pkg.version = newVersion;

        // Maintain ending newline if it existed
        const endingNewline = content.endsWith('\n') ? '\n' : '';
        await writeFile(
            packageJsonPath,
            JSON.stringify(pkg, null, 4) + endingNewline,
            'utf8',
        );

        console.log(
            `${chalk.green('✔')} ${chalk.bold(pkg.name || packagePath)}: ${chalk.gray(oldVersion)} → ${chalk.blue(newVersion)}`,
        );
    } catch (err: any) {
        if (err.code === 'ENOENT') {
            return;
        }
        console.error(
            `${chalk.red('✘')} Failed to update ${packagePath}: ${err.message}`,
        );
    }
}

async function main() {
    const newVersion = process.argv[2];

    if (!newVersion) {
        console.log(
            `\n${chalk.yellow('Usage:')} bun run scripts/version.ts ${chalk.cyan('<new-version>')}`,
        );
        process.exit(1);
    }

    // Basic version validation (major.minor.patch or with suffix)
    if (!/^\d+\.\d+\.\d+(?:-.+)?$/.test(newVersion)) {
        console.warn(
            chalk.yellow(
                `⚠ Warning: "${newVersion}" doesn't look like a standard semver version. Proceeding anyway...\n`,
            ),
        );
    }

    const rootDir = process.cwd();
    const packagesDir = join(rootDir, 'packages');

    console.log(
        chalk.cyan(`\n🚀 Updating versions to ${chalk.bold(newVersion)}...\n`),
    );

    // Update all packages in ./packages
    try {
        const entries = await readdir(packagesDir, { withFileTypes: true });
        const packageFolders = entries
            .filter((entry) => entry.isDirectory())
            .map((entry) => join(packagesDir, entry.name));

        for (const pkgPath of packageFolders) {
            await updatePackageVersion(pkgPath, newVersion);
        }

        console.log(
            chalk.green(chalk.bold('\n✨ All package versions updated!')),
        );
    } catch (err: any) {
        console.error(
            chalk.red(`\nFailed to read packages directory: ${err.message}`),
        );
        process.exit(1);
    }
}

main();
