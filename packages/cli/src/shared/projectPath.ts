import chalk from 'chalk';

import { absDirectoryEnsured } from './absPath.js';
import { cliError } from './cliError.js';

export function retrieveProjectPath(projectPathArg?: string): string {
    if (projectPathArg) {
        return projectPathArg;
    }

    return process.env.ERUDIT_PROJECT_PATH || '.';
}

export function normalizeProjectPath(projectPath: string): string {
    let absProjectPath: string;

    try {
        absProjectPath = absDirectoryEnsured(projectPath);
    } catch (error) {
        throw cliError('Error normalizing project path!', error);
    }

    return absProjectPath;
}

export function logProjectPath(projectPath: string): void {
    console.log('Project path:', chalk.bold.cyan(projectPath));
}
