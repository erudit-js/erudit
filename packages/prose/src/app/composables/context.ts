import { inject, type Component, type InjectionKey, type Ref } from 'vue';
import type { EruditLanguageCode } from '@erudit-js/core/eruditConfig/language';
import type { EruditMode } from '@erudit-js/core/mode';

import type { AppElement } from '../appElement.js';

export interface ProseContext {
    mode: EruditMode;
    languageCode: EruditLanguageCode;
    appElements: Record<string, AppElement>;
    formatText: (text: string) => string;
    pathUrl: string;
    baseUrl: string;
    hashUrl: Ref<string | undefined>;
    eruditIcons: Record<string, string>;
    EruditTransition: Component;
    EruditIcon: Component;
    EruditLink: Component;
    setPreview: (previewRequest: any) => void;
    closePreview: () => void;
    loadingSvg: string;
}

export const proseContextSymbol = Symbol() as InjectionKey<ProseContext>;

export function useProseContext() {
    return inject(proseContextSymbol)!;
}
