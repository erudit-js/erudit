import type { Component, InjectionKey, Ref } from 'vue';

import type { AppElementDefinitions } from '../../appElement';
import type { GenericStorage } from '../../../storage';

export interface ProseAppContext {
    sitePath: string;
    languageCode: string;
    storage: GenericStorage;
    appElements: AppElementDefinitions;
    loadingSvg: string;
    formatText: (text: string) => string;
    hashId: Ref<string | undefined>;
    MaybeMyIcon: Component<{ name: string }>;
    TransitionFade: Component;
}

export const proseContextSymbol = Symbol() as InjectionKey<ProseAppContext>;
