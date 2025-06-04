import { glob } from 'glob';
import { PROJECT_DIR } from '#erudit/globalPaths';

export default defineEventHandler(async () => {
    const avatars = await glob('contributors/*/avatar.*', {
        cwd: PROJECT_DIR,
        absolute: false,
        posix: true,
    });

    return avatars.map((avatar) => '/asset/' + avatar);
});
