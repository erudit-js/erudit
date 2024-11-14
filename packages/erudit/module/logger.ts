import { createConsola } from 'consola';
import { brandColorTitle } from 'erudit-cog/utils/brand';

const tag = brandColorTitle + ' Module';

export const logger = createConsola({
    defaults: {
        tag,
    },
});
