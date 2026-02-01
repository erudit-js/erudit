import chalk from 'chalk';

export function cliError(message: string, causeError?: any) {
    const error = new Error(`\n${chalk.red(message)}\n${causeError ?? ''}`, {
        cause: causeError,
    });
    error.name = '';
    return error;
}
