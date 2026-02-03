import { createConsola } from 'consola';
import { brandColorTitle } from '@erudit-js/core/brandTerminal';

const tag = brandColorTitle + ' Module';

export const moduleLogger = createConsola({
  defaults: {
    tag,
  },
});
