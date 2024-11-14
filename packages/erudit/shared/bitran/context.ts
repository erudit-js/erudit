import { type Aliases } from '@erudit-js/bitran-elements/aliases/shared';

import type { BitranLocation } from './location';

export interface BitranContext {
    location: BitranLocation;
    aliases: Aliases;
}
