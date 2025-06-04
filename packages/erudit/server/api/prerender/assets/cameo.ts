import { PROJECT_DIR } from '#erudit/globalPaths';
import { glob } from 'glob';

const includePatterns = [`cameos/*/avatars/*`];

export default defineEventHandler(async () => {
    const files = await glob(includePatterns, {
        cwd: PROJECT_DIR,
        absolute: false,
        posix: true,
    });

    return files.map((file) => '/asset/' + file);
});
