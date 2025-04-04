import * as fs from 'node:fs';
import * as path from 'node:path';

interface FileMap {
    [simplifiedPath: string]: string;
}

// Regex to check if a directory is a "content directory".
const contentFileRegex = /^(book|group|topic)\.(js|ts)$/i;

// Regex to simplify directory names (remove leading digits + '+' or '-').
const simplifyDirRegex = /^\d+(?:\+|-)/;

/**
 * Recursively scans files starting from `dirPath` and builds a mapping where:
 *  - The key is the "simplified" path using forward slashes.
 *  - The value is the relative filesystem path, also using forward slashes.
 *
 * A directory is considered a "content directory" if it contains any file that matches:
 * book, group, or topic with a .js or .ts extension.
 * When a directory qualifies as a content directory, its name is simplified
 * by removing any leading digits and a '+' or '-' (e.g., "29+foo" becomes "foo").
 *
 * @param dirPath The root directory to scan.
 * @returns An object mapping simplified file paths to relative file paths.
 */
export function scanFiles(dirPath: string): FileMap {
    const result: FileMap = {};
    const absoluteRoot = path.resolve(dirPath); // Ensure absolute root path

    function isContentDirectory(directory: string): boolean {
        try {
            return fs
                .readdirSync(directory)
                .some((entry) => contentFileRegex.test(entry));
        } catch {
            return false;
        }
    }

    function traverse(currentPath: string, simplifiedParts: string[]) {
        let currentSimplifiedParts = simplifiedParts;
        if (currentPath !== absoluteRoot) {
            let dirName = path.basename(currentPath);
            if (isContentDirectory(currentPath)) {
                dirName = dirName.replace(simplifyDirRegex, '');
            }
            currentSimplifiedParts = [...simplifiedParts, dirName];
        }

        for (const entry of fs.readdirSync(currentPath)) {
            const fullPath = path.join(currentPath, entry);
            const relativePath = path
                .relative(absoluteRoot, fullPath)
                .replace(/\\/g, '/'); // Always forward slashes
            const stat = fs.statSync(fullPath);

            if (stat.isDirectory()) {
                traverse(fullPath, currentSimplifiedParts);
            } else if (stat.isFile()) {
                const simplifiedFilePath = path.posix.join(
                    ...currentSimplifiedParts,
                    entry,
                );

                // Remove first repeating part in the key
                const keyParts = simplifiedFilePath.split('/');
                if (keyParts.length > 1 && keyParts[0] === keyParts[1]) {
                    keyParts.shift(); // Remove first repeating part
                }

                result[keyParts.join('/')] = relativePath;
            }
        }
    }

    traverse(absoluteRoot, []);
    return result;
}
