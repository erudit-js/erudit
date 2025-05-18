import type { RenderDataStorage } from '@bitran-js/core';
import type { BitranContext } from '@erudit-js/cog/schema';

export interface RawBitranContent {
    biCode: string;
    storage: RenderDataStorage;
    routes: string[];
    context: BitranContext;
}
