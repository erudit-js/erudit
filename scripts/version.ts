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
      JSON.stringify(pkg, null, 2) + endingNewline,
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

async function updateBunLock(newVersion: string) {
  const bunLockPath = join(process.cwd(), 'bun.lock');
  try {
    let content = await readFile(bunLockPath, 'utf8');
    let updatedCount = 0;

    // Update version fields in packages/ workspaces using regex
    // Matches: "packages/xxx": { ... "version": "x.y.z", ... }
    content = content.replace(
      /(["']packages\/[^"']+["']:\s*\{[^}]*["']version["']:\s*["'])([^"']+)(["'])/g,
      (match, before, oldVersion, after) => {
        updatedCount++;
        return before + newVersion + after;
      },
    );

    await writeFile(bunLockPath, content, 'utf8');

    console.log(
      `${chalk.green('✔')} ${chalk.bold('bun.lock')}: Updated ${updatedCount} workspace versions`,
    );
  } catch (err: any) {
    if (err.code === 'ENOENT') {
      console.log(chalk.yellow('⚠ bun.lock not found, skipping...'));
      return;
    }
    console.error(
      `${chalk.red('✘')} Failed to update bun.lock: ${err.message}`,
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

    // Update bun.lock
    await updateBunLock(newVersion);

    console.log(chalk.green(chalk.bold('\n✨ All package versions updated!')));
  } catch (err: any) {
    console.error(
      chalk.red(`\nFailed to read packages directory: ${err.message}`),
    );
    process.exit(1);
  }
}

main();
