import chalk from 'chalk';

export function logCommand(command: string) {
  console.log(`Running command: ${chalk.bold.cyan(command)}`);
}
