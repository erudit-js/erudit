import { spawn } from 'node:child_process';

interface NuxtConfig {
    command: 'prepare' | 'dev' | 'build' | 'generate';
    absProjectPath: string;
    restArgs?: string | string[];
    env?: Record<string, string>;
}

export async function spawnNuxt(config: NuxtConfig) {
    const onClose = (exitCode: number) => {
        switch (exitCode) {
            case 0:
                console.log('Nuxt process exited successfully!');
                return;
            case 1337:
                console.warn('Nuxt full restart is requested!');
                _spawnNuxt();
                return;
            default:
                console.error(`Nuxt process exited with code ${exitCode}!`);
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
}

// type NuxtCommand = 'dev' | 'build' | 'generate' | 'prepare';

// export async function spawnNuxt(
//     command: NuxtCommand,
//     projectPath: string,
//     restParams?: string,
// ) {
//     return new Promise<void>((resolve) => {
//         const onClose = (exitCode: number) => {
//             if (exitCode === 0) {
//                 console.log('Nuxt process exited successfully!');
//                 return resolve();
//             }

//             if (exitCode === 1) {
//                 console.error('Nuxt process exited with an error!');
//                 return resolve();
//             }

//             if (exitCode === 1337) {
//                 console.warn('Nuxt full restart is requested!');
//                 _spawnNuxt();
//                 return;
//             }

//             if (command === 'dev') {
//                 console.error(
//                     `Nuxt process exited with an error code ${exitCode} in development mode!\nRespawning...`,
//                 );
//                 _spawnNuxt();
//                 return;
//             }
//         };

//         const _spawnNuxt = () => {
//             const mode: EruditMode | undefined = (() => {
//                 switch (command) {
//                     case 'dev':
//                     case 'prepare':
//                         return 'dev';
//                     case 'build':
//                         return 'write';
//                     case 'generate':
//                         return 'static';
//                 }
//             })();

//             const nuxtProcess = spawn(
//                 `nuxt ${command} ${projectPath}/.erudit/nuxt ${restParams || ''}`,
//                 {
//                     shell: true,
//                     stdio: 'inherit',
//                     env: {
//                         ...process.env,
//                         ERUDIT_PROJECT_DIR: projectPath,
//                         ERUDIT_COMMAND: command,
//                         ERUDIT_MODE: mode,
//                     },
//                 },
//             );

//             nuxtProcess.on('close', onClose);
//         };

//         _spawnNuxt();
//     });
// }
