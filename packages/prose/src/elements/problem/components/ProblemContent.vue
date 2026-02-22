<script lang="ts" setup>
import {
  computed,
  onMounted,
  ref,
  shallowRef,
  watchEffect,
  type Component,
} from 'vue';
import { isProseElement, type ToProseElement } from 'tsprose';

import {
  problemAnswer,
  problemDescriptionSchema,
  problemHintSchema,
  problemNote,
  problemSolution,
  type ProblemContentChild,
} from '../problemContent.js';
import { problemCheckSchema } from '../problemCheck.js';
import type { CheckFunction } from '../problemScript.js';
import { useProseContext } from '../../../app/composables/context.js';
import { useProblemPhrase } from '../composables/phrase.js';
import type { ProblemAction } from '../shared.js';
import { useArrayContainsAnchor } from '../../../app/composables/anchor.js';
import type { ProblemScriptInstance } from '../problemScript.js';
import type { ProblemSchema } from '../problem.js';
import type { subProblemSchema } from '../problems.js';
import { useElementStorage } from '../../../app/composables/storage.js';
import type { ProblemScriptStorage } from '../storage.js';
import { createProblemScriptInstance } from '../composables/problemScript.js';
import { DEFAULT_SEED, type ProblemSeed } from '../rng.js';
import Render from '../../../app/shared/Render.vue';
import Hint from './expanders/Hint.vue';
import DefaultPlusSections from './expanders/DefaultPlusSections.vue';
import ProblemButton from './ProblemButton.vue';
import Checks from './expanders/Checks.vue';
import ProblemButtonGenerate from './ProblemButtonGenerate.vue';
import { eruditRawToProse } from '../../../rawToProse/index.js';

const { element, initialElements } = defineProps<{
  element:
    | ToProseElement<ProblemSchema>
    | ToProseElement<typeof subProblemSchema>;
  initialElements: ToProseElement<ProblemContentChild>[];
}>();

const { EruditIcon } = useProseContext();
const phrase = await useProblemPhrase();

const actionIcons: Record<ProblemAction, string> = Object.fromEntries(
  Object.entries(
    // @ts-ignore
    import.meta.glob('../assets/actions/*.svg', {
      query: 'raw',
      eager: true,
      import: 'default',
    }),
  ).map(([key, value]) => {
    const name = key.split('/').pop()?.replace('.svg', '') ?? key;
    return [name as any, value as string];
  }),
);

const key = ref(0);
const elements =
  shallowRef<ToProseElement<ProblemContentChild>[]>(initialElements);

const description = computed(() => {
  return elements.value.find((element) =>
    isProseElement(element, problemDescriptionSchema),
  )!;
});

const expanderComponents: Record<
  Exclude<ProblemAction, 'generate'>,
  Component
> = {
  check: Checks,
  hint: Hint,
  answer: DefaultPlusSections,
  solution: DefaultPlusSections,
  note: DefaultPlusSections,
};

const expandableActions = computed(() => {
  type ActionMap<T> =
    T extends Partial<Exclude<Record<ProblemAction, any>, 'generate'>>
      ? T
      : never;

  const actionMap: ActionMap<{
    hint?: ToProseElement<typeof problemHintSchema>[];
    answer?: ToProseElement<typeof problemAnswer.schema>;
    solution?: ToProseElement<typeof problemSolution.schema>;
    note?: ToProseElement<typeof problemNote.schema>;
    check?: {
      checkElements: ToProseElement<typeof problemCheckSchema>[];
      checkFunction?: CheckFunction;
    };
  }> = {};

  const checks = elements.value.filter((element) =>
    isProseElement(element, problemCheckSchema),
  );
  if (checks.length > 0) {
    actionMap.check = {
      checkElements: checks,
      checkFunction: scriptCheck.value,
    };
  }

  const hints = elements.value.filter((element) =>
    isProseElement(element, problemHintSchema),
  );
  if (hints.length > 0) {
    actionMap.hint = hints;
  }

  (['answer', 'solution', 'note'] as const).forEach((action) => {
    const actionElements = elements.value.filter((element) => {
      switch (action) {
        case 'answer':
          return isProseElement(element, problemAnswer.schema);
        case 'solution':
          return isProseElement(element, problemSolution.schema);
        case 'note':
          return isProseElement(element, problemNote.schema);
      }
    });

    if (actionElements.length > 0) {
      actionMap[action] = actionElements[0]! as any;
    }
  });

  return actionMap;
});

const currentAction = ref<Exclude<ProblemAction, 'generate'>>();

const containsAnchorArray = useArrayContainsAnchor(elements.value);

watchEffect(() => {
  const anchorIndex = containsAnchorArray.value;

  if (anchorIndex === undefined) {
    return;
  }

  const anchorElement = elements.value.at(anchorIndex);

  switch (true) {
    case isProseElement(anchorElement, problemHintSchema):
      currentAction.value = 'hint';
      break;
    case isProseElement(anchorElement, problemAnswer.schema):
      currentAction.value = 'answer';
      break;
    case isProseElement(anchorElement, problemSolution.schema):
      currentAction.value = 'solution';
      break;
    case isProseElement(anchorElement, problemNote.schema):
      currentAction.value = 'note';
      break;
  }
});

//
// Problem Script
//

const scriptInstance = shallowRef<ProblemScriptInstance>();
const scriptStorage = (await useElementStorage(
  element as any,
)) as ProblemScriptStorage;
const isGenerator = computed(() => Boolean(scriptInstance.value?.isGenerator));
const scriptCheck = shallowRef<CheckFunction>();

onMounted(async () => {
  scriptInstance.value = await createProblemScriptInstance(
    scriptStorage?.resolvedScriptSrc,
    element.data.scriptUniques,
  );

  if (scriptInstance.value) {
    const initialGenerateResult = scriptInstance.value!.generate(DEFAULT_SEED);
    scriptCheck.value = initialGenerateResult.check;
  }
});

let currentSeed: ProblemSeed = DEFAULT_SEED;
async function doGenerate(seed: ProblemSeed) {
  if (!scriptInstance.value) {
    return;
  }

  currentSeed = seed;

  const generateResult = scriptInstance.value.generate(seed);

  if (generateResult.check) {
    scriptCheck.value = generateResult.check;
  }

  const rawElements = generateResult.problemContent;
  const proseElements: ToProseElement<ProblemContentChild>[] = [];
  for (const rawElement of rawElements) {
    const resolveResult = await eruditRawToProse({ rawProse: rawElement });
    proseElements.push(resolveResult.prose as any);
  }

  if (currentSeed !== seed) {
    // A new generation has been requested while we were async generating.
    return;
  }

  elements.value = proseElements;
  key.value++;
}
</script>

<template>
  <div>
    <Suspense suspensible>
      <div class="py-(--proseAsideWidth)" :key>
        <Render v-for="child of description.children" :element="child" />
      </div>
    </Suspense>

    <div
      v-if="Object.values(expandableActions).some(Boolean) || isGenerator"
      class="gap-small micro:gap-normal flex flex-wrap p-(--proseAsideWidth)
        pt-0"
    >
      <ProblemButton
        v-for="(_, actionKey) in expandableActions"
        :key="actionKey"
        @click="
          currentAction = actionKey === currentAction ? undefined : actionKey
        "
        :active="actionKey === currentAction"
        class="flex items-center gap-[7px]"
      >
        <EruditIcon :name="actionIcons[actionKey]" class="text-[1.3em]" />
        <span>{{ phrase[`action_${actionKey}`] }}</span>
      </ProblemButton>
      <ProblemButtonGenerate v-if="isGenerator" @generate="doGenerate" />
    </div>

    <Suspense suspensible>
      <component
        v-if="currentAction"
        :key="`${key}-${currentAction}`"
        :is="expanderComponents[currentAction]"
        :value="expandableActions[currentAction]"
      />
    </Suspense>
  </div>
</template>
