import { spawn } from 'node:child_process';

interface NuxtConfig {
  command: 'prepare' | 'dev' | 'build' | 'generate';
  absProjectPath: string;
  restArgs?: string | string[];
  env?: Record<string, string>;
}

export async function spawnNuxt(config: NuxtConfig) {
  return new Promise<void>((resolve, reject) => {
    const onClose = (exitCode: number) => {
      switch (exitCode) {
        case 0:
          console.log('Nuxt process exited successfully!');
          resolve();
          return;
        case 1337:
          console.warn('Nuxt full restart is requested!');
          _spawnNuxt();
          return;
        default:
          console.error(`Nuxt process exited with code ${exitCode}!`);
          reject();
          return;
      }
    };

    const _spawnNuxt = () => {
      const restArgs = Array.isArray(config.restArgs)
        ? config.restArgs.join(' ')
        : config.restArgs || '';

      const nuxtProcess = spawn(
        `nuxt ${config.command} ${config.absProjectPath}/.erudit/nuxt ${restArgs}`,
        {
          shell: true,
          stdio: 'inherit',
          env: {
            ...process.env,
            ...config.env,
          },
        },
      );

      nuxtProcess.on('close', onClose);
    };

    _spawnNuxt();
  });
}
