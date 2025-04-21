import { watch, readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { spawn } from 'node:child_process';
import { createHash } from 'node:crypto';

// Configuration
const SRC_DIR = join(process.cwd(), 'src');
const DEBOUNCE_DELAY = 150;

// Track changed files
const changedFiles = new Set<string>();
// Store file hashes (path -> hash)
const fileHashes = new Map<string, string>();

// Function to compute file hash
const computeFileHash = (filePath: string): string => {
    try {
        const fullPath = join(SRC_DIR, filePath);
        const content = readFileSync(fullPath);
        return createHash('sha256').update(content).digest('hex');
    } catch (error) {
        // File might have been deleted or can't be read
        return 'FILE_NOT_FOUND';
    }
};

// Function to recursively scan directory and compute file hashes
const scanDirectory = (dir: string): void => {
    try {
        const entries = readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(dir, entry.name);

            if (entry.isDirectory()) {
                // Recursively scan subdirectories
                scanDirectory(fullPath);
            } else if (entry.isFile()) {
                // Compute hash for the file using relative path
                const relativePath = relative(SRC_DIR, fullPath);
                const hash = computeFileHash(relativePath);
                if (hash !== 'FILE_NOT_FOUND') {
                    fileHashes.set(relativePath, hash);
                }
            }
        }
    } catch (error) {
        console.error(`❌ Error scanning directory ${dir}:`, error);
    }
};

// Temporary storage for file changes during debounce period
const pendingChanges = new Set<string>();

// Debounce function for processing file changes
let timeout: NodeJS.Timeout | null = null;
const debounce = (fn: () => void) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        timeout = null;
        fn();
    }, DEBOUNCE_DELAY);
};

// Function to process file changes
const processFileChanges = () => {
    // Process all pending changes
    pendingChanges.forEach((filename) => {
        // Compute new hash
        const newHash = computeFileHash(filename);
        const oldHash = fileHashes.get(filename);

        if (newHash === 'FILE_NOT_FOUND') {
            console.log(`🗑️ File deleted: ${filename}`);
            fileHashes.delete(filename);
            changedFiles.add(filename);
        } else if (oldHash === newHash) {
            console.log(
                `🔍 No content change: ${filename} (hash: ${newHash.substring(0, 8)})`,
            );
            // Skip rebuild since content hasn't changed
        } else {
            // Content has changed or new file detected
            fileHashes.set(filename, newHash);
            changedFiles.add(filename);

            if (oldHash) {
                console.log(
                    `📝 Content changed: ${filename} (${oldHash.substring(0, 8)} → ${newHash.substring(0, 8)})`,
                );
            } else {
                console.log(
                    `🆕 New file detected: ${filename} (hash: ${newHash.substring(0, 8)})`,
                );
            }
        }
    });

    // Clear pending changes
    pendingChanges.clear();

    // If there are actual changes that require a build, run it
    if (changedFiles.size > 0) {
        runBuild();
    }
};

// Function to run the build command
const runBuild = async () => {
    // Log all changed files when build is triggered
    if (changedFiles.size > 0) {
        console.log('🔄 Changed files:');
        changedFiles.forEach((file) => console.log(`  - ${file}`));
        changedFiles.clear(); // Clear the set after logging
    }

    console.log('🔨 Building...');

    try {
        // Capture stdout and stderr instead of inheriting
        const proc = spawn('bun', ['run', 'build', '--', '--no-clean'], {
            stdio: ['ignore', 'pipe', 'pipe'],
            shell: true,
        });

        // Collect stdout and stderr
        let stdoutData = '';
        let stderrData = '';

        proc.stdout?.on('data', (data) => {
            stdoutData += data.toString();
        });

        proc.stderr?.on('data', (data) => {
            stderrData += data.toString();
        });

        proc.on('error', (error) => {
            console.error('❌ Build process error:', error);
        });

        proc.on('close', (exitCode) => {
            if (exitCode === 0) {
                console.log('✅ Build completed successfully');
            } else {
                console.error(`❌ Build failed with exit code ${exitCode}`);
                // Only show output if build failed
                if (stdoutData) {
                    console.log('Build output:');
                    console.log(stdoutData);
                }
                if (stderrData) {
                    console.error('Build errors:');
                    console.error(stderrData);
                }
            }
        });
    } catch (error) {
        console.error('❌ Build process error:', error);
    }
};

// Initialize file hashes
console.log('📝 Computing initial file hashes...');
scanDirectory(SRC_DIR);
console.log(`✅ Hashed ${fileHashes.size} files`);

// Watch for file changes
console.log(`👀 Watching for changes in ${SRC_DIR}...`);

try {
    watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
        if (filename) {
            // Add filename to pending changes
            pendingChanges.add(filename);
            // Debounce the processing of all changes
            debounce(processFileChanges);
        }
    });
} catch (error) {
    console.error(`❌ Error setting up file watcher: ${error}`);
    process.exit(1);
}

// Initial build
console.log('📦 Starting initial build...');
runBuild();
