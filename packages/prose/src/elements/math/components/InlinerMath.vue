<script lang="ts" setup>
import 'katex/dist/katex.min.css';
import type { ToProseElement } from 'tsprose';

import Inliner from '../../../app/shared/inliner/Inliner.vue';
import {
  createInlinerMathStorage,
  type InlinerMathSchema,
} from '../inliner.js';
import { useElementStorage } from '../../../app/composables/storage.js';
import Katex from './Katex.vue';

const { element } = defineProps<{
  element: ToProseElement<InlinerMathSchema>;
}>();

const inlinerMathStorage =
  (await useElementStorage(element)) ??
  (await createInlinerMathStorage(element.data));
</script>

<template>
  <Inliner :element>
    <template v-if="inlinerMathStorage.type === 'text'">
      <span :class="[$style.inlinerMath, $style.textMath]">
        <template v-for="token of inlinerMathStorage.tokens">
          <span :class="{ [$style.word]: token.type === 'word' }">
            {{ token.value }}
          </span>
        </template>
      </span>
    </template>
    <Katex
      v-else
      :class="$style.inlinerMath"
      :math="inlinerMathStorage.mathHtml"
      mode="inline"
      :freeze="false"
    />
  </Inliner>
</template>

<style module>
.inlinerMath {
  --katex-color_default: light-dark(
    color-mix(in hsl, var(--color-text-muted), var(--color-brand) 35%),
    color-mix(in hsl, var(--color-text), var(--color-brand) 30%)
  );
}

.textMath {
  font:
    normal 1.15em KaTeX_Main,
    Times New Roman,
    serif;
  line-height: 1.2;
  text-indent: 0;
  color: var(--katex-color_default);

  .word {
    font-family: KaTeX_Math;
    font-style: italic;
  }
}
</style>
