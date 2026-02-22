<script setup lang="ts">
import { computed, ref } from 'vue';
import { isProseElement, type ToProseElement } from 'tsprose';

import type { CheckFunction } from '../../problemScript.js';
import {
  problemCheckSchema,
  type ProblemCheckSchema,
} from '../../problemCheck.js';
import ProblemExpander from '../ProblemExpander.vue';
import Check from './Check.vue';

type CheckProseElement = ToProseElement<ProblemCheckSchema>;
type CheckStatus = 'default' | 'correct' | 'wrong';

const { value } = defineProps<{
  value: {
    checkElements: CheckProseElement[];
    checkFunction?: CheckFunction;
  };
}>();

let checkIdCounter = 0;
const checkIdMap = new WeakMap<CheckProseElement, string>();

function getCheckId(check: CheckProseElement) {
  if (!checkIdMap.has(check)) {
    checkIdMap.set(check, `check-${++checkIdCounter}`);
  }
  return checkIdMap.get(check)!;
}

function collectAllChecks(
  checks: CheckProseElement[],
  parent?: CheckProseElement,
): CheckProseElement[] {
  const result: CheckProseElement[] = [];

  for (const check of checks) {
    // attach parent reference if not present
    (check as any)._parent = parent ?? null;
    result.push(check);

    const children = (check.children ?? []).filter((child) =>
      isProseElement(child, problemCheckSchema),
    ) as CheckProseElement[];

    if (children.length) {
      result.push(...collectAllChecks(children, check));
    }
  }

  return result;
}

const allChecks = computed(() => collectAllChecks(value.checkElements));

const checkStatus = ref<Record<string, CheckStatus>>({});

function setStatus(check: CheckProseElement, status: CheckStatus) {
  checkStatus.value[getCheckId(check)] = status;
}

function isVisible(check: CheckProseElement) {
  const parent = (check as any)._parent as CheckProseElement | null;

  if (!parent) return true;

  // Check all ancestors in the parent tree
  let current: CheckProseElement | null = parent;
  while (current) {
    const status = checkStatus.value[getCheckId(current)];
    if (status !== 'correct') {
      return false;
    }
    current = (current as any)._parent as CheckProseElement | null;
  }

  return true;
}

const scriptAnswers = ref<Record<string, string | undefined>>({});

const scriptCheckNameMap = computed(() => {
  const map = new Map<CheckProseElement, string>();
  for (const check of allChecks.value) {
    if (check.data.serializedValidator.type === 'script') {
      map.set(check, check.data.serializedValidator.name);
    }
  }
  return map;
});

function scriptCheckFunction(
  check: CheckProseElement,
  answer: string | undefined,
) {
  if (!value.checkFunction) {
    console.warn('No check function defined for script checks!');
    return false;
  }

  const name = scriptCheckNameMap.value.get(check)!;

  const result = value.checkFunction({
    name,
    answer,
    answers: scriptAnswers.value,
  });

  if (result === true) {
    scriptAnswers.value[name] = answer;
  } else {
    delete scriptAnswers.value[name];
  }

  return result;
}

function scriptClearFunction(check: CheckProseElement) {
  const name = scriptCheckNameMap.value.get(check);
  if (name) delete scriptAnswers.value[name];
}
</script>

<template>
  <ProblemExpander>
    <div
      class="micro:grid-cols-2 grid gap-(--proseAsideWidth)
        p-(--proseAsideWidth)"
    >
      <Check
        v-for="check in allChecks"
        :key="getCheckId(check)"
        :check="check"
        v-show="isVisible(check)"
        :script="
          check.data.serializedValidator.type === 'script'
            ? {
                check: (answer) => scriptCheckFunction(check, answer),
                clear: () => scriptClearFunction(check),
              }
            : undefined
        "
        @status-change="(status) => setStatus(check, status)"
      />
    </div>
  </ProblemExpander>
</template>
