import { spawn } from 'node:child_process';

type NuxtCommand = 'dev' | 'build' | 'generate' | 'prepare';

export async function spawnNuxt(command: NuxtCommand, projectPath: string) {
    return new Promise<void>((resolve) => {
        const onClose = (exitCode: number) => {
            if (exitCode === 1337) _spawnNuxt();
            else if (exitCode !== 0)
                throw new Error(`Nuxt exited with code ${exitCode}!`);
            else resolve();
        };

        const _spawnNuxt = () => {
            const nuxtProcess = spawn(
                `nuxt ${command} ${projectPath}/.erudit/nuxt`,
                {
                    shell: true,
                    stdio: 'inherit',
                    env: {
                        ...process.env,
                        ERUDIT_PROJECT_DIR: projectPath,
                    },
                },
            );

            nuxtProcess.on('close', onClose);
        };

        _spawnNuxt();
    });
}
