import { spawn } from 'node:child_process';

type NuxtCommand = 'dev' | 'build' | 'generate' | 'prepare';

export async function spawnNuxt(
    command: NuxtCommand,
    projectPath: string,
    restParams?: string,
) {
    return new Promise<void>((resolve) => {
        const onClose = (exitCode: number) => {
            if (exitCode === 0) {
                console.log('Nuxt process exited successfully!');
                return resolve();
            }

            if (exitCode === 1) {
                console.error('Nuxt process exited with an error!');
                return resolve();
            }

            if (exitCode === 1337) {
                console.warn('Nuxt full restart is requested!');
                _spawnNuxt();
                return;
            }

            if (command === 'dev') {
                console.error(
                    `Nuxt process exited with an error code ${exitCode} in development mode!\nRespawning...`,
                );
                _spawnNuxt();
                return;
            }
        };

        const _spawnNuxt = () => {
            const nuxtProcess = spawn(
                `nuxt ${command} ${projectPath}/.erudit/nuxt ${restParams || ''}`,
                {
                    shell: true,
                    stdio: 'inherit',
                    env: {
                        ...process.env,
                        ERUDIT_PROJECT_DIR: projectPath,
                        ERUDIT_MODE: command,
                    },
                },
            );

            nuxtProcess.on('close', onClose);
        };

        _spawnNuxt();
    });
}
