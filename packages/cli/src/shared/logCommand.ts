import { styleText } from 'node:util';

export function logCommand(command: string) {
  console.log(`Running command: ${styleText(['bold', 'cyan'], command)}`);
}
