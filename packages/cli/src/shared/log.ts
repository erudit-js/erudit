import chalk from 'chalk';
import { consola } from 'consola';

export function logCommand(command: string) {
    consola.info(`Running command: ${chalk.cyanBright(command)}`);
    console.log();
}
