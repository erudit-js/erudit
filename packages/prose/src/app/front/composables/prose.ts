import type { InjectionKey } from 'vue';

import type { AppElementDefinitions } from '../../appElement';
import type { GenericStorage } from '../../../storage';

export interface ProseContext {
    storage: GenericStorage;
    appElements: AppElementDefinitions;
}

export const proseContextSymbol = Symbol() as InjectionKey<ProseContext>;
