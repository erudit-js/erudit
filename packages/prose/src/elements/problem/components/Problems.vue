<script setup lang="ts">
import { ref, watchEffect } from 'vue';
import {
  isProseElement,
  type BlockSchema,
  type ProseElement,
} from '@jsprose/core';

import { subProblemSchema, type problemsSchema } from '../problems.js';
import { useFormatText } from '../../../app/composables/formatText.js';
import { useArrayContainsAnchor } from '../../../app/composables/anchor.js';
import SubProblem from './SubProblem.vue';
import Block from '../../../app/shared/block/Block.vue';
import ProblemContainer from './ProblemContainer.vue';
import ProblemHeader from './ProblemHeader.vue';
import Render from '../../../app/shared/Render.vue';
import ProblemButton from './ProblemButton.vue';

const { element } = defineProps<{
  element: ProseElement<typeof problemsSchema>;
}>();

const formatText = useFormatText();

const sharedChildren = element.children.filter(
  (child) => !isProseElement(child, subProblemSchema),
) as ProseElement<BlockSchema>[];

const subProblems = element.children.filter((child) =>
  isProseElement(child, subProblemSchema),
) as ProseElement<typeof subProblemSchema>[];

const activeSubProblemI = ref(0);

function getUnlabeledOrdinal(index: number) {
  let count = 0;
  for (let i = 0; i <= index; i++) {
    if (!subProblems[i].data.label) count++;
  }
  return count;
}

const containsAnchorI = useArrayContainsAnchor(subProblems);

watchEffect(() => {
  if (containsAnchorI.value !== undefined) {
    activeSubProblemI.value = containsAnchorI.value;
  }
});
</script>

<template>
  <Block :element>
    <ProblemContainer>
      <ProblemHeader :info="element.data" />
      <div v-if="sharedChildren.length" class="pt-(--proseAsideWidth)">
        <Render v-for="sharedChild of sharedChildren" :element="sharedChild" />
      </div>
      <div
        class="gap-small micro:gap-normal border-border micro:*:px-4 flex
          flex-wrap border-b px-(--proseAsideWidth) py-(--proseAsideWidth)"
      >
        <ProblemButton
          v-for="(subProblem, i) of subProblems"
          :active="i === activeSubProblemI"
          @click="activeSubProblemI = i"
        >
          {{
            subProblem.data.label
              ? formatText(subProblem.data.label)
              : getUnlabeledOrdinal(i)
          }}
        </ProblemButton>
      </div>
      <Suspense>
        <SubProblem
          :key="activeSubProblemI"
          :element="subProblems[activeSubProblemI]"
        />
      </Suspense>
    </ProblemContainer>
  </Block>
</template>
