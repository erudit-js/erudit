import {
  inject,
  type Component,
  type InjectionKey,
  type Ref,
  type TemplateRef,
} from 'vue';
import type { useFloating, UseFloatingOptions } from '@floating-ui/vue';
import type { EruditLanguageCode } from '@erudit-js/core/eruditConfig/language';
import type { EruditMode } from '@erudit-js/core/mode';
import type { FormatText } from '@erudit-js/core/formatText';

import type { ProseAppElement } from '../appElement.js';

export interface ProseContext {
  mode: EruditMode;
  setHtmlIds: boolean;
  languageCode: EruditLanguageCode;
  appElements: Record<string, ProseAppElement>;
  formatText: FormatText;
  pathUrl: string;
  baseUrl: string;
  hashUrl: Ref<string | undefined>;
  eruditIcons: Record<string, string>;
  EruditTransition: Component;
  EruditIcon: Component;
  EruditLink: Component;
  setPreview: (previewRequest: any) => void;
  closePreview: () => void;
  usePopup: (
    containerElement: TemplateRef<HTMLElement>,
    toggleElement: TemplateRef<HTMLElement>,
    popupElement: TemplateRef<HTMLElement>,
    options?: UseFloatingOptions,
  ) => {
    popupVisible: Ref<boolean>;
    popupStyles: ReturnType<typeof useFloating>['floatingStyles'];
  };
  loadingSvg: string;
}

export const proseContextSymbol = Symbol() as InjectionKey<ProseContext>;

export function useProseContext() {
  return inject(proseContextSymbol)!;
}
