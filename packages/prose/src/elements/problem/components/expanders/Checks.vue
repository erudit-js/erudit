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

const scriptCheckFunction = (answer: string | undefined, name: string) => {
    if (!value.checkFunction) {
        console.warn('No check function defined for script checks!');
        return false;
    }

    const checkResult = value.checkFunction({
        answer,
        name,
        answers: scriptAnswers.value,
    });

    if (checkResult === true) {
        scriptAnswers.value[name] = answer;
    } else {
        delete scriptAnswers.value[name];
    }

    return checkResult;
};

const scriptClearFunction = (name: string) => {
    delete scriptAnswers.value[name];
};

const scriptCheckNameMap = new Map<
    ProseElement<typeof problemCheckSchema>,
    string
>();
for (const checkElement of value.checkElements) {
    if (checkElement.data.script) {
        scriptCheckNameMap.set(checkElement, checkElement.data.script);
    }
}

const scriptAnswers = ref<Record<string, string | undefined>>({});
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
                                  const name = scriptCheckNameMap.get(check)!;
                                  return scriptCheckFunction(answer, name);
                              },
                              clear: () => {
                                  const name = scriptCheckNameMap.get(check)!;
                                  scriptClearFunction(name);
                              },
                          }
                        : undefined
                "
            />
        </div>
    </ProblemExpander>
</template>
