<script setup lang="ts">
import { ref, computed, onMounted, shallowRef } from 'vue';
import type { ProseElement, ToProseElement } from 'tsprose';

import {
  checkProblemAnswer,
  fromSerializableValidator,
  type ProblemCheckSchema,
  type ProblemCheckContext,
  type ProblemCheckValidatorSelect,
  type ProblemCheckValidatorBoolean,
} from '../../problemCheck.js';
import checkIcon from '../../assets/actions/check.svg?raw';
import plusIcon from '../../../../app/shared/assets/plus.svg?raw';
import successIcon from '../../../../app/shared/assets/check.svg?raw';
import { useFormatText } from '../../../../app/composables/formatText.js';
import { useProseContext } from '../../../../app/index.js';
import { useProblemPhrase } from '../../composables/phrase.js';
import { eruditRawToProse } from '../../../../rawToProse/index.js';
import Render from '../../../../app/shared/Render.vue';
import {
  type CheckStatus,
  createBaseStatusStyles,
  useCheckLabel,
} from './shared.js';

const { check, script, isBoolean } = defineProps<{
  check: ToProseElement<ProblemCheckSchema>;
  script?: {
    check: (answer: string | undefined) => boolean;
    clear: () => void;
  };
  isBoolean?: boolean;
}>();

const emit = defineEmits<{
  (event: 'status-change', status: CheckStatus): void;
}>();

const formatText = useFormatText();
const { EruditIcon, EruditTransition, loadingSvg, problemCheckers } =
  useProseContext();
const phrase = await useProblemPhrase();

const state = ref<CheckStatus>('default');
const selected = ref<Set<number>>(new Set());

const validator = computed(() => {
  return fromSerializableValidator(check.data.serializedValidator);
});

const selectValidator = computed((): ProblemCheckValidatorSelect | null => {
  const v = validator.value;
  if ('type' in v && v.type === 'select') {
    return v as ProblemCheckValidatorSelect;
  }
  return null;
});

const booleanValidator = computed((): ProblemCheckValidatorBoolean | null => {
  const v = validator.value;
  if ('type' in v && v.type === 'boolean') {
    return v as ProblemCheckValidatorBoolean;
  }
  return null;
});

const isMultiple = computed(() => {
  if (isBoolean) return false;
  return selectValidator.value?.multiple ?? false;
});

const columns = computed(() => {
  if (isBoolean) return 2;
  return selectValidator.value?.columns ?? 2;
});

// Resolved prose elements for each option
const resolvedOptions = shallowRef<ProseElement[][]>([]);

const labelText = useCheckLabel(check, phrase, formatText);

// Status styling
const statusStyles = createBaseStatusStyles({
  check: checkIcon,
  loading: loadingSvg,
  success: successIcon,
  plus: plusIcon,
});

const currentStatus = computed(() => statusStyles[state.value]);
const isLoading = computed(() => state.value === 'loading');

const selectOptionClass =
  'bg-bg-main text-main-sm focus-visible:ring-brand cursor-pointer rounded border px-3 py-2 text-left outline-0 transition-[border,color,background] focus-visible:ring-2 [&_aside]:hidden';

const selectOptionStyle = { '--proseAsideWidth': '0px', '--proseGap': '0px' };

function optionClass(index: number) {
  const isSelected = selected.value.has(index);

  if (state.value === 'correct' && isSelected) {
    return 'border-lime-500 bg-lime-500/10 text-lime-600';
  }

  if (state.value === 'wrong' && isSelected) {
    return 'border-red-400 bg-red-400/10 text-red-700 dark:text-red-400';
  }

  if (isSelected) {
    return 'border-brand bg-brand/10 text-brand';
  }

  return 'border-border text-text hocus:border-text-muted';
}

// Resolve raw option content to prose elements
onMounted(async () => {
  if (isBoolean) {
    // Boolean mode: no raw content to resolve
    return;
  }

  const sv = selectValidator.value;
  if (!sv) return;

  const resolved: ProseElement[][] = [];
  for (const option of sv.options) {
    const proseElements: ProseElement[] = [];
    for (const rawEl of option.content) {
      if (rawEl && typeof rawEl === 'object') {
        const result = await eruditRawToProse({ rawProse: rawEl });
        proseElements.push(result.prose);
      }
    }
    resolved.push(proseElements);
  }

  resolvedOptions.value = resolved;
});

function toggleOption(index: number) {
  if (isLoading.value) return;

  const newSelected = new Set(selected.value);

  if (newSelected.has(index)) {
    newSelected.delete(index);
  } else {
    if (!isMultiple.value) {
      newSelected.clear();
    }
    newSelected.add(index);
  }

  selected.value = newSelected;

  // Reset state when selection changes
  state.value = 'default';
  script?.clear();
  emit('status-change', 'default');

  // For single-select, check immediately
  if (!isMultiple.value && newSelected.size > 0) {
    doCheck();
  }

  // For single-select deselection (cleared), keep default state
}

async function doCheck() {
  if (selected.value.size === 0) {
    return;
  }

  state.value = 'loading';

  const answerStr = [...selected.value].sort((a, b) => a - b).join(',');

  if (script) {
    const ok = script.check(answerStr);
    state.value = ok ? 'correct' : 'wrong';
    emit('status-change', state.value);
    return;
  }

  if (isBoolean && booleanValidator.value) {
    // Boolean mode: index 0 = Yes, index 1 = No
    const selectedYes = selected.value.has(0);
    const isCorrect = booleanValidator.value.answer === selectedYes;
    state.value = isCorrect ? 'correct' : 'wrong';
    emit('status-change', state.value);
    return;
  }

  const checkContext: ProblemCheckContext = {
    yesRegexp: phrase.yes_regexp,
    noRegexp: phrase.no_regexp,
    checkers: problemCheckers,
  };

  state.value = (await checkProblemAnswer(
    answerStr,
    validator.value,
    checkContext,
  ))
    ? 'correct'
    : 'wrong';

  emit('status-change', state.value);
}

const gridStyle = computed(() => ({
  gridTemplateColumns: `repeat(auto-fill, minmax(min(100%, ${100 / columns.value}% - 8px), 1fr))`,
}));
</script>

<template>
  <div class="gap-small flex w-full flex-col">
    <div
      :class="[
        'text-main-sm font-medium transition-[color]',
        currentStatus.labelClass,
      ]"
    >
      <span>{{ labelText }}</span>
    </div>

    <div
      role="listbox"
      :aria-multiselectable="isMultiple"
      class="grid gap-2"
      :style="gridStyle"
    >
      <!-- Boolean mode -->
      <template v-if="isBoolean">
        <button
          v-for="(label, index) in [
            phrase.boolean_option_yes,
            phrase.boolean_option_no,
          ]"
          :key="index"
          type="button"
          role="option"
          :aria-selected="selected.has(index)"
          :disabled="isLoading"
          :class="[selectOptionClass, 'font-medium', optionClass(index)]"
          @click="toggleOption(index)"
        >
          {{ label }}
        </button>
      </template>

      <!-- Select mode with prose content -->
      <template v-else>
        <Suspense
          v-for="(proseElements, index) in resolvedOptions"
          :key="index"
          suspensible
        >
          <button
            type="button"
            role="option"
            :aria-selected="selected.has(index)"
            :disabled="isLoading"
            :class="[selectOptionClass, optionClass(index)]"
            :style="selectOptionStyle"
            @click="toggleOption(index)"
          >
            <Render
              v-for="(proseEl, elIndex) in proseElements"
              :key="elIndex"
              :element="proseEl"
            />
          </button>
        </Suspense>
      </template>
    </div>

    <!-- Multi-select confirm button -->
    <div v-if="isMultiple" class="flex items-center gap-2">
      <button
        type="button"
        :disabled="isLoading || selected.size === 0"
        :class="[
          `bg-bg-main border-border/80 text-main-xs micro:px-2.5 cursor-pointer
          rounded border px-1.5 py-1.25 font-semibold shadow
          shadow-[light-dark(#d9d9d9,#3c3c3c)]
          transition-[color,background,border,box-shadow]`,
          selected.size > 0
            ? 'text-text-muted hocus:text-brand hocus:border-brand/50'
            : 'text-text-disabled cursor-not-allowed',
        ]"
        @click="doCheck"
      >
        <span class="flex items-center gap-1.75">
          <EruditIcon :name="checkIcon" class="text-[1.3em]" />
          <span>{{ phrase.select_confirm }}</span>
        </span>
      </button>

      <!-- Status icon for multi-select -->
      <div class="relative">
        <EruditIcon :name="checkIcon" class="invisible text-[1.3em]" />
        <EruditTransition>
          <EruditIcon
            v-if="state !== 'default'"
            :key="state"
            :name="statusStyles[state].icon"
            :class="[
              'absolute top-1/2 left-1/2 -translate-1/2 text-[1.3em]',
              statusStyles[state].iconClass,
              statusStyles[state].labelClass,
            ]"
          />
        </EruditTransition>
      </div>
    </div>

    <div v-if="check.data.hint" class="text-text-dimmed text-main-xs italic">
      {{ formatText(check.data.hint) }}
    </div>
  </div>
</template>
