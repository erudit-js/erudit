import { inject, type Component, type InjectionKey, type Ref } from 'vue';
import type { EruditMode } from '@erudit-js/cog/schema';

import type { AppElementDefinitions } from '../../appElement';
import type { GenericStorage } from '../../../storage';

export interface ProseAppContext {
    mode: EruditMode;
    sitePath: string;
    siteBaseUrl: string;
    languageCode: string;
    storage: GenericStorage;
    appElements: AppElementDefinitions;
    loadingSvg: string;
    formatText: (text: string) => string;
    hashId: Ref<string | undefined>;
    MaybeMyIcon: Component<{ name: string }>;
    TransitionFade: Component;
    usePreview: any;
    icons: Record<string, string>;
    EruditLink: Component;
}

export const proseContextSymbol = Symbol() as InjectionKey<ProseAppContext>;

export function useProseAppContext() {
    return inject(proseContextSymbol)!;
}
