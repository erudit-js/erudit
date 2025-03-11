import { watch } from 'node:fs';
import { join } from 'node:path';
import { spawn } from 'node:child_process';

// Configuration
const SRC_DIR = join(process.cwd(), 'src');
const DEBOUNCE_DELAY = 150;

// Track changed files
const changedFiles = new Set<string>();

// Debounce function to prevent multiple builds
let timeout: NodeJS.Timeout | null = null;
const debounce = (fn: () => void) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
        timeout = null;
        fn();
    }, DEBOUNCE_DELAY);
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
        const proc = spawn('bun', ['run', 'build', '--', '--no-clean'], {
            stdio: 'inherit',
            shell: true,
        });

        proc.on('error', (error) => {
            console.error('❌ Build process error:', error);
        });

        proc.on('close', (exitCode) => {
            if (exitCode === 0) {
                console.log('✅ Build completed successfully');
            } else {
                console.error(`❌ Build failed with exit code ${exitCode}`);
            }
        });
    } catch (error) {
        console.error('❌ Build process error:', error);
    }
};

// Watch for file changes
console.log(`👀 Watching for changes in ${SRC_DIR}...`);

try {
    watch(SRC_DIR, { recursive: true }, (eventType, filename) => {
        if (filename) {
            changedFiles.add(filename);
            debounce(runBuild);
        }
    });
} catch (error) {
    console.error(`❌ Error setting up file watcher: ${error}`);
    process.exit(1);
}

// Initial build
console.log('📦 Starting initial build...');
runBuild();
