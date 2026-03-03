import { styleText } from 'node:util';

export function cliError(message: string, causeError?: any) {
  const error = new Error(
    `\n${styleText('red', message)}\n${causeError ?? ''}`,
    {
      cause: causeError,
    },
  );
  error.name = '';
  return error;
}
