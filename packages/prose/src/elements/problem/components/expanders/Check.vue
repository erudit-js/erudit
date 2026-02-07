<script setup lang="ts">
import { useTemplateRef, ref, watch, computed } from 'vue';
import type { ProseElement } from '@jsprose/core';

import {
  checkProblemAnswer,
  fromSerializableValidator,
  type problemCheckSchema,
} from '../../problemCheck.js';
import checkIcon from '../../assets/actions/check.svg?raw';
import plusIcon from '../../../../app/shared/assets/plus.svg?raw';
import successIcon from '../../../../app/shared/assets/check.svg?raw';
import { useFormatText } from '../../../../app/composables/formatText.js';
import { useProseContext } from '../../../../app/index.js';
import { useProblemPhrase } from '../../composables/phrase.js';

type CheckStatus = 'default' | 'correct' | 'wrong';

type CheckState = {
  icon: string;
  iconClass?: string;
  labelClass: string;
  inputClass: string;
  buttonClass: string;
};

const { check, script } = defineProps<{
  check: ProseElement<typeof problemCheckSchema>;
  script?: {
    check: (answer: string | undefined) => boolean;
    clear: () => void;
  };
}>();

const validator = computed(() => {
  return fromSerializableValidator(check.data.serializedValidator);
});

const emit = defineEmits<{
  (event: 'status-change', status: CheckStatus): void;
}>();

const states: Record<CheckStatus, CheckState> = {
  default: {
    icon: checkIcon,
    labelClass: 'text-text-muted',
    inputClass: 'border-border text-text',
    buttonClass:
      'text-text-muted border-border hocus:border-text-muted hocus:text-text',
  },
  correct: {
    icon: successIcon,
    labelClass: 'text-lime-600',
    inputClass: 'text-lime-600 border-lime-500',
    buttonClass: 'text-lime-600 border-lime-500',
  },
  wrong: {
    icon: plusIcon,
    iconClass: 'rotate-45',
    labelClass: 'text-red-700 dark:text-red-400',
    inputClass: 'text-red-700 dark:text-red-400 border-red-400',
    buttonClass: 'text-red-700 dark:text-red-400 border-red-400',
  },
};

const state = ref<CheckStatus>('default');

const formatText = useFormatText();
const { EruditIcon, EruditTransition } = useProseContext();
const phrase = await useProblemPhrase();

const hint = computed(() => {
  if (check.data.hint) {
    return check.data.hint;
  }

  if (check.data.serializedValidator.type === 'boolean') {
    return phrase.boolean_check_hint;
  }

  if (check.data.serializedValidator.type === 'array') {
    return phrase.array_check_hint(
      check.data.serializedValidator.ordered,
      check.data.serializedValidator.separator,
    );
  }
});

const answerInputElement = useTemplateRef<HTMLInputElement>('answer');
const answerInput = ref('');
const lastCheckedInput = ref<string | undefined | null>(null);

watch(answerInput, () => {
  state.value = 'default';
  lastCheckedInput.value = null;
  script?.clear();
  emit('status-change', 'default');
});

function doCheck() {
  console.log(script);

  const newInput = answerInput.value.replace(/\s+/g, ' ').trim();

  if (newInput === lastCheckedInput.value) {
    return;
  }

  lastCheckedInput.value = newInput;

  if (script) {
    const ok = script.check(newInput || undefined);
    state.value = ok ? 'correct' : 'wrong';
    emit('status-change', state.value);
    return;
  }

  state.value = checkProblemAnswer(
    newInput,
    phrase.yes_regexp,
    phrase.no_regexp,
    validator.value,
  )
    ? 'correct'
    : 'wrong';

  emit('status-change', state.value);
}
</script>

<template>
  <div class="gap-small flex w-full flex-col">
    <div
      :class="[
        'text-main-sm font-medium transition-[color]',
        states[state].labelClass,
      ]"
    >
      <span @click="answerInputElement?.focus()">
        {{ formatText(check.data.label ?? phrase.action_answer) + ':' }}
      </span>
    </div>

    <form class="flex" @submit.prevent="doCheck">
      <input
        ref="answer"
        v-model="answerInput"
        type="text"
        autocomplete="off"
        :placeholder="check.data.placeholder"
        :class="[
          `bg-bg-main text-main-sm relative z-10 min-w-0 flex-1 rounded
          rounded-tr-none rounded-br-none border border-r-0 px-2.5 py-1
          transition-[border,color,background]`,
          states[state].inputClass,
        ]"
      />

      <button
        type="submit"
        :class="[
          `bg-bg-main relative w-[50px] cursor-pointer rounded rounded-tl-none
          rounded-bl-none border outline-0 transition-[border,color,background]`,
          states[state].buttonClass,
        ]"
      >
        <EruditIcon
          :key="state"
          :name="states[state].icon"
          :class="['invisible m-auto text-[1.2em]', states[state].iconClass]"
        />
        <EruditTransition>
          <EruditIcon
            :key="state"
            :name="states[state].icon"
            :class="[
              'absolute top-1/2 left-1/2 -translate-1/2 text-[1.2em]',
              states[state].iconClass,
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
