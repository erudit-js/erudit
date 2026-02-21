<script lang="ts" setup>
import { mixSchema, textSchema, type ProseElement } from 'tsprose';
import { paragraphSchema } from '@erudit-js/prose/elements/paragraph/core';

import Mix from './elements/Mix.vue';
import P from './elements/P.vue';
import Text from './elements/Text.vue';
import { refSchema } from '@erudit-js/prose/elements/link/reference/core';
import Ref from './elements/Ref.vue';

const { element } = defineProps<{ element: ProseElement }>();

const ElementComponent = (() => {
  switch (element.schema.name) {
    case textSchema.name:
      return Text;
    case paragraphSchema.name:
      return P;
    case refSchema.name:
      return Ref;
    case mixSchema.name:
      return Mix;
    default:
      return h(
        'span',
        { class: 'text-red-500 font-semibold font-mono' },
        `<${element.schema.name} />`,
      );
  }
})();
</script>

<template>
  <ElementComponent v-if="element" :element />
</template>
