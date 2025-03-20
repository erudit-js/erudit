import type { BitranAliases } from './aliases';
import type { BitranLocation } from './location';

export interface BitranContext {
    location: BitranLocation;
    aliases: BitranAliases;
}
