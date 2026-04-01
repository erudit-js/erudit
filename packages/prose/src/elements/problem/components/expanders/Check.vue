<script setup lang="ts">
import { useTemplateRef, ref, watch, computed } from 'vue';
import type { ToProseElement } from 'tsprose';

import {
  checkProblemAnswer,
  fromSerializableValidator,
  type ProblemCheckSchema,
  type ProblemCheckContext,
} from '../../problemCheck.js';
import checkIcon from '../../assets/actions/check.svg?raw';
import plusIcon from '../../../../app/shared/assets/plus.svg?raw';
import successIcon from '../../../../app/shared/assets/check.svg?raw';
import { useFormatText } from '../../../../app/composables/formatText.js';
import { useProseContext } from '../../../../app/index.js';
import { useProblemPhrase } from '../../composables/phrase.js';
import CheckSelect from './CheckSelect.vue';
import {
  type CheckStatus,
  createBaseStatusStyles,
  useCheckLabel,
} from './shared.js';

type CheckState = {
  icon: string;
  iconClass?: string;
  labelClass: string;
  inputClass: string;
  buttonClass: string;
};

const { check, script } = defineProps<{
  check: ToProseElement<ProblemCheckSchema>;
  script?: {
    check: (answer: string | undefined) => boolean;
    clear: () => void;
  };
}>();

const validator = computed(() => {
  return fromSerializableValidator(check.data.serializedValidator);
});

const isSelectMode = computed(() => {
  const v = check.data.serializedValidator;
  return v.type === 'select' || v.type === 'boolean';
});

const isBooleanMode = computed(() => {
  return check.data.serializedValidator.type === 'boolean';
});

const emit = defineEmits<{
  (event: 'status-change', status: CheckStatus): void;
}>();

const state = ref<CheckStatus>('default');

const formatText = useFormatText();
const { EruditIcon, EruditTransition, loadingSvg, problemCheckers } =
  useProseContext();
const phrase = await useProblemPhrase();

const inputButtonStyles: Record<
  CheckStatus,
  { inputClass: string; buttonClass: string }
> = {
  default: {
    inputClass: 'border-border text-text',
    buttonClass:
      'text-text-muted border-border hocus:border-text-muted hocus:text-text',
  },
  loading: {
    inputClass: 'border-border text-text',
    buttonClass: 'text-text-muted border-border',
  },
  correct: {
    inputClass: 'text-lime-600 border-lime-500',
    buttonClass: 'text-lime-600 border-lime-500',
  },
  wrong: {
    inputClass: 'text-red-700 dark:text-red-400 border-red-400',
    buttonClass: 'text-red-700 dark:text-red-400 border-red-400',
  },
};

const baseStyles = createBaseStatusStyles({
  check: checkIcon,
  loading: loadingSvg,
  success: successIcon,
  plus: plusIcon,
});

const states: Record<CheckStatus, CheckState> = Object.fromEntries(
  (Object.keys(baseStyles) as CheckStatus[]).map((key) => [
    key,
    { ...baseStyles[key], ...inputButtonStyles[key] },
  ]),
) as Record<CheckStatus, CheckState>;

const currentState = computed(() => states[state.value]);
const isLoading = computed(() => state.value === 'loading');

const hint = computed(() => {
  if (check.data.hint) {
    return check.data.hint;
  }

  if (check.data.serializedValidator.type === 'array') {
    return phrase.array_check_hint(
      check.data.serializedValidator.ordered,
      check.data.serializedValidator.separator,
    );
  }
});

const labelText = useCheckLabel(check, phrase, formatText);

const answerInputElement = useTemplateRef<HTMLInputElement>('answer');
const answerInput = ref('');
const lastCheckedInput = ref<string | undefined | null>(null);

watch(answerInput, () => {
  state.value = 'default';
  lastCheckedInput.value = null;
  script?.clear();
  emit('status-change', 'default');
});

async function doCheck() {
  const newInput = answerInput.value.replace(/\s+/g, ' ').trim();

  if (newInput === lastCheckedInput.value) {
    return;
  }

  lastCheckedInput.value = newInput;
  state.value = 'loading';

  if (script) {
    const ok = script.check(newInput || undefined);
    state.value = ok ? 'correct' : 'wrong';
    emit('status-change', state.value);
    return;
  }

  const checkContext: ProblemCheckContext = {
    yesRegexp: phrase.yes_regexp,
    noRegexp: phrase.no_regexp,
    checkers: problemCheckers,
  };

  state.value = (await checkProblemAnswer(
    newInput,
    validator.value,
    checkContext,
  ))
    ? 'correct'
    : 'wrong';

  emit('status-change', state.value);
}
</script>

<template>
  <Suspense v-if="isSelectMode" suspensible>
    <CheckSelect
      :check="check"
      :script="script"
      :isBoolean="isBooleanMode"
      @status-change="(status) => emit('status-change', status)"
    />
  </Suspense>
  <div v-else class="gap-small flex w-full flex-col">
    <div
      :class="[
        'text-main-sm font-medium transition-[color]',
        currentState.labelClass,
      ]"
    >
      <span @click="answerInputElement?.focus()">
        {{ labelText }}
      </span>
    </div>

    <form class="flex" @submit.prevent="doCheck">
      <input
        ref="answer"
        v-model="answerInput"
        type="text"
        autocomplete="off"
        :disabled="isLoading"
        :placeholder="check.data.placeholder"
        :class="[
          `bg-bg-main text-main-sm focus:ring-brand relative z-10 min-w-0 flex-1
          rounded rounded-tr-none rounded-br-none border border-r-0 px-2.5 py-1
          ring-2 ring-transparent outline-0
          transition-[border,color,background,box-shadow]`,
          currentState.inputClass,
        ]"
      />

      <button
        type="submit"
        :disabled="isLoading"
        :class="[
          `bg-bg-main relative w-12.5 cursor-pointer rounded rounded-tl-none
          rounded-bl-none border outline-0 transition-[border,color,background]`,
          currentState.buttonClass,
        ]"
      >
        <EruditIcon
          :key="state"
          :name="currentState.icon"
          :class="['invisible m-auto text-[1.2em]', currentState.iconClass]"
        />
        <EruditTransition>
          <EruditIcon
            :key="state"
            :name="currentState.icon"
            :class="[
              'absolute top-1/2 left-1/2 -translate-1/2 text-[1.2em]',
              currentState.iconClass,
            ]"
          />
        </EruditTransition>
      </button>
    </form>

    <div class="text-text-dimmed text-main-xs italic">
      {{ hint ? formatText(hint) : '' }}
    </div>
  </div>
</template>
