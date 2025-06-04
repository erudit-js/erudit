import { readdir } from 'node:fs/promises';
import { PROJECT_DIR } from '#erudit/globalPaths';

export async function getCameoIds() {
    try {
        const dirents = await readdir(`${PROJECT_DIR}/cameos`, {
            withFileTypes: true,
        });

        return dirents
            .filter((dirent) => dirent.isDirectory())
            .map((dirent) => dirent.name);
    } catch {
        return [];
    }
}
