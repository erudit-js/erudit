import { spawn } from 'node:child_process';
//import { locateErudit } from './locateErudit';

type NuxtCommand = 'dev' | 'generate' | 'prepare';

export async function spawnNuxt(command: NuxtCommand, projectPath: string) {
    return new Promise<void>((resolve) => {
        const onClose = (exitCode: number) => {
            if (exitCode === 1337) _spawnNuxt();
            else if (exitCode !== 0)
                throw new Error(`Nuxt exited with code ${exitCode}!`);
            else resolve();
        };

        const _spawnNuxt = () => {
            //const eruditPackagePath = locateErudit(projectPath);

            const nuxtProcess = spawn(
                `nuxt ${command} ${projectPath}/.erudit/nuxt`,
                {
                    shell: true,
                    stdio: 'inherit',
                    env: {
                        ...process.env,
                        //ERUDIT_PACKAGE_DIR: eruditPackagePath,
                        ERUDIT_PROJECT_DIR: projectPath,
                    },
                },
            );

            nuxtProcess.on('close', onClose);
        };

        _spawnNuxt();
    });
}
