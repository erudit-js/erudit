import chalk, { type ChalkInstance } from 'chalk';

export function stress(message: string, contentChalk?: ChalkInstance) {
    return (
        chalk.dim(`'`) +
        (contentChalk ? contentChalk(message) : chalk.cyanBright(message)) +
        chalk.dim(`'`)
    );
}
