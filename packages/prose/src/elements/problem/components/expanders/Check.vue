<script lang="ts" setup>
import { useTemplateRef, ref, watch } from 'vue';
import type { ProseElement } from '@jsprose/core';

import type { problemCheckSchema } from '../../problemContent.js';
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

const answerInputElement = useTemplateRef('answer');
const answerInput = ref<string>('');

watch(answerInput, () => {
    state.value = 'default';
    script?.clear();
});

function doCheck() {
    let newInput = answerInput.value.trim().replace(/\s+/g, ' ') || undefined;

    if (script) {
        const isCorrect = script.check(newInput);
        state.value = isCorrect ? 'correct' : 'wrong';
        return;
    }

    const isCorrect = check.data.answers?.includes(newInput);
    state.value = isCorrect ? 'correct' : 'wrong';
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
                type="text"
                name="answer"
                v-model="answerInput"
                :placeholder="check.data.placeholder"
                autocomplete="off"
                :class="[
                    `bg-bg-main text-main-sm relative z-10 min-w-0 flex-1
                    rounded rounded-tr-none rounded-br-none border border-r-0
                    px-2.5 py-1 transition-[border,color,background]`,
                    states[state].inputClass,
                ]"
            />
            <button
                type="submit"
                :class="[
                    `bg-bg-main relative w-[50px] cursor-pointer rounded
                    rounded-tl-none rounded-bl-none border outline-0
                    transition-[border,color,background]`,
                    states[state].buttonClass,
                ]"
            >
                <EruditIcon
                    :key="state"
                    :name="states[state].icon"
                    :class="['invisible m-auto', states[state].iconClass]"
                />
                <EruditTransition>
                    <EruditIcon
                        :key="state"
                        :name="states[state].icon"
                        :class="[
                            'absolute top-1/2 left-1/2 -translate-1/2',
                            states[state].iconClass,
                        ]"
                    />
                </EruditTransition>
            </button>
        </form>

        <div class="text-text-dimmed text-main-xs italic">
            {{ check.data.hint ? formatText(check.data.hint) : '' }}
        </div>
    </div>
</template>
