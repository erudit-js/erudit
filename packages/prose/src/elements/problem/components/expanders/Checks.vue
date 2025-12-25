<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import type { ProseElement } from '@jsprose/core';

import type {
    CheckFunction,
    problemCheckSchema,
} from '../../problemContent.js';
import ProblemExpander from '../ProblemExpander.vue';
import Check from './Check.vue';

const { value } = defineProps<{
    value: {
        checkElements: ProseElement<typeof problemCheckSchema>[];
        checkFunction?: CheckFunction;
    };
}>();

const scriptCheckFunction = (answer: string | undefined, index: number) => {
    if (!value.checkFunction) {
        console.warn('No check function defined for script checks!');
        return false;
    }

    const checkResult = value.checkFunction({
        answer,
        i: index,
        answers: scriptAnswers.value,
    });

    if (checkResult === true) {
        scriptAnswers.value[index] = answer;
    } else {
        delete scriptAnswers.value[index];
    }

    return checkResult;
};

const scriptClearFunction = (index: number) => {
    delete scriptAnswers.value[index];
};

const scriptChecks: ProseElement<typeof problemCheckSchema>[] = [];
const scriptCheckIndexMap = new Map<
    ProseElement<typeof problemCheckSchema>,
    number
>();
for (const checkElement of value.checkElements) {
    if (checkElement.data.script) {
        scriptCheckIndexMap.set(checkElement, scriptChecks.length);
        scriptChecks.push(checkElement);
    }
}

const scriptAnswers = ref<Record<string | number, string | undefined>>({});
</script>

<template>
    <ProblemExpander>
        <div
            class="micro:grid-cols-2 grid gap-(--proseAsideWidth)
                p-(--proseAsideWidth)"
        >
            <Check
                v-for="check of value.checkElements"
                :check
                :script="
                    check.data.script
                        ? {
                              check: (answer: string | undefined) => {
                                  const index = scriptCheckIndexMap.get(check)!;
                                  return scriptCheckFunction(answer, index);
                              },
                              clear: () => {
                                  const index = scriptCheckIndexMap.get(check)!;
                                  scriptClearFunction(index);
                              },
                          }
                        : undefined
                "
            />
        </div>
    </ProblemExpander>
</template>
