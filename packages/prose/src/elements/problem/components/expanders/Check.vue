<script lang="ts" setup>
import { useTemplateRef, ref, watch } from 'vue';

import { useFormatText, useProseAppContext } from '../../../../app';
import { useIcon } from '../../../../app/front/composables/icon';
import type { ParsedElement } from '../../../../element';
import { useProblemPhrase } from '../../composables/phrase';
import type { ProblemCheckSchema } from '../../content';

import checkIcon from '../../assets/actions/check.svg?raw';
import plusIcon from '../../../../app/front/assets/plus.svg?raw';
import successIcon from '../../../../app/front/assets/check.svg?raw';

type CheckStatus = 'default' | 'correct' | 'wrong';
type CheckState = {
    icon: string;
    iconClass?: string;
    labelClass: string;
    inputClass: string;
    buttonClass: string;
};

const { check } = defineProps<{ check: ParsedElement<ProblemCheckSchema> }>();

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
const Icon = useIcon();
const phrase = await useProblemPhrase();
const { TransitionFade } = useProseAppContext();

const answerInputElement = useTemplateRef('answer');
const answerInput = ref<string>('');

watch(answerInput, () => {
    state.value = 'default';
});

function doCheck() {
    const newInput = answerInput.value.trim().replace(/\s+/g, ' ');
    if (check.data.answers.includes(newInput)) {
        state.value = 'correct';
    } else {
        state.value = 'wrong';
    }
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
                    `bg-bg-main text-main-sm relative min-w-0 flex-1 rounded
                    rounded-tr-none rounded-br-none border border-r-0 px-[10px]
                    py-[4px] transition-[border,color,background]`,
                    states[state].inputClass,
                ]"
            />
            <button
                type="submit"
                :class="[
                    `bg-bg-main w-[50px] cursor-pointer rounded rounded-tl-none
                    rounded-bl-none border outline-0
                    transition-[border,color,background]`,
                    states[state].buttonClass,
                ]"
            >
                <TransitionFade mode="out-in">
                    <Icon
                        :key="state"
                        :name="states[state].icon"
                        :class="['m-auto', states[state].iconClass]"
                    />
                </TransitionFade>
            </button>
        </form>

        <div class="text-text-dimmed text-main-xs italic">
            {{ check.data.hint ? formatText(check.data.hint) : '' }}
        </div>
    </div>
</template>
