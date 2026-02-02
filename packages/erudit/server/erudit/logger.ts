import chalk from 'chalk';
import { brandColorTitle } from '@erudit-js/core/brandTerminal';

interface Logger {
  info(message: any): void;
  start(message: any): void;
  success(message: any): void;
  warn(message: any): void;
  error(message: any): void;
  stress(message: any): string;
}

export type EruditServerLogger = Logger & {
  debug: Logger;
};

export async function setupServerLogger() {
  const serverLogger = createLogger(brandColorTitle + ' Server');
  const serverDebugLogger = createLogger(brandColorTitle + ' Server Debug');
  const debugLogEnabled = !!ERUDIT.config.public.debug.log;

  ERUDIT.log = new Proxy(serverLogger, {
    get(target, prop) {
      if (prop === 'debug') {
        if (!debugLogEnabled) {
          return new Proxy(
            {},
            {
              get() {
                return () => {};
              },
            },
          );
        }
        return serverDebugLogger;
      }
      return target[prop as keyof typeof target];
    },
  }) as EruditServerLogger;

  ERUDIT.log.success('Logger setup complete!');
}

function createLogger(tag: string): Logger {
  const formattedTag = chalk.gray(`[${tag}]`);

  return {
    info(message: any) {
      console.log(`${formattedTag} ${chalk.blueBright('ℹ')} ${message}`);
    },
    start(message: any) {
      console.log(`${formattedTag} ${chalk.magentaBright('◐')} ${message}`);
    },
    success(message: any) {
      console.log(`${formattedTag} ${chalk.greenBright('✔')} ${message}`);
    },
    warn(message: any) {
      console.log(
        `${formattedTag} ${chalk.bgYellowBright.black(' WARN ')} ${message}`,
      );
    },
    error(message: any) {
      console.log();
      console.log(
        `${formattedTag} ${chalk.bgRed.whiteBright(' ERROR ')} ${message}`,
      );
      console.log();
    },
    stress(message: any) {
      return chalk.cyanBright(message);
    },
  };
}
