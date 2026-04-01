import { computed, type ComputedRef } from 'vue';
import type { ToProseElement } from 'tsprose';

import type { ProblemCheckSchema } from '../../problemCheck.js';

export type CheckStatus = 'default' | 'loading' | 'correct' | 'wrong';

export interface CheckStatusStyle {
  icon: string;
  iconClass?: string;
  labelClass: string;
}

export function createBaseStatusStyles(icons: {
  check: string;
  loading: string;
  success: string;
  plus: string;
}): Record<CheckStatus, CheckStatusStyle> {
  return {
    default: {
      icon: icons.check,
      labelClass: 'text-text-muted',
    },
    loading: {
      icon: icons.loading,
      labelClass: 'text-text-muted',
    },
    correct: {
      icon: icons.success,
      labelClass: 'text-lime-600',
    },
    wrong: {
      icon: icons.plus,
      iconClass: 'rotate-45',
      labelClass: 'text-red-700 dark:text-red-400',
    },
  };
}

export function useCheckLabel(
  check: ToProseElement<ProblemCheckSchema>,
  phrase: { action_answer: string },
  formatText: (text: string) => string,
): ComputedRef<string> {
  return computed(() => {
    const rawLabel = formatText(check.data.label ?? phrase.action_answer);
    const trimmed = rawLabel.trimEnd();

    if (!trimmed) {
      return '';
    }

    const endsWithAlphaNum = /[\p{L}\p{N}]$/u.test(trimmed);
    return endsWithAlphaNum ? `${trimmed}:` : trimmed;
  });
}
