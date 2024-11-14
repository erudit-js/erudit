import { createJiti } from 'jiti';
import { ERUDIT_DIR } from '#erudit/globalPaths';

const jiti = createJiti(ERUDIT_DIR, {
    // Enable reimporting same files during process in development mode
    fsCache: !import.meta.dev,
    moduleCache: !import.meta.dev,
});

export async function IMPORT(...args: Parameters<typeof jiti.import>) {
    return jiti.import(...args) as Promise<any>;
}
