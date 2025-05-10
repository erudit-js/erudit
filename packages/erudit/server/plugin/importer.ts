import { createJiti } from 'jiti';
import { ERUDIT_DIR, PROJECT_DIR } from '#erudit/globalPaths';

export const jiti = createJiti(ERUDIT_DIR, {
    // Enable reimporting same files during process in development mode
    fsCache: !import.meta.dev,
    moduleCache: !import.meta.dev,
    alias: {
        '#project': PROJECT_DIR,
        '#content': PROJECT_DIR + '/content',
    },
});

export async function IMPORT(...args: Parameters<typeof jiti.import>) {
    return jiti.import(...args) as Promise<any>;
}
