import { createConsola } from 'consola';
import { brandColorTitle } from 'erudit-cog/utils/brandNode';

const tag = brandColorTitle + ' Module';

export const logger = createConsola({
    defaults: {
        tag,
    },
});
