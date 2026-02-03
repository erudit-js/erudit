<script lang="ts" setup>
import type { ProseElement } from '@jsprose/core';

import type { problemHintSchema } from '../../problemContent.js';
import { useProblemPhrase } from '../../composables/phrase.js';
import ProblemExpander from '../ProblemExpander.vue';
import Render from '../../../../app/shared/Render.vue';
import ProblemExpanderSection from '../ProblemExpanderSection.vue';

defineProps<{ value: ProseElement<typeof problemHintSchema>[] }>();
const phrase = await useProblemPhrase();
</script>

<template>
  <ProblemExpander>
    <div v-if="value.length === 1" class="py-(--proseAsideWidth)">
      <Render v-for="child of value[0]!.children" :element="child" />
    </div>
    <ProblemExpanderSection
      v-else
      v-for="(hint, i) of value"
      :title="phrase.action_hint + ' ' + (i + 1)"
      :element="hint"
    />
  </ProblemExpander>
</template>
