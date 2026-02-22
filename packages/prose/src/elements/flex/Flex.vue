<script lang="ts" setup>
import type { ToProseElement } from 'tsprose';

import type { FlexSchema } from './core.js';
import Block from '../../app/shared/block/Block.vue';
import Render from '../../app/shared/Render.vue';

const { element } = defineProps<{ element: ToProseElement<FlexSchema> }>();

const justify = (() => {
  return element?.data?.justifyContent ?? 'center';
})();

const gap = (() => {
  return element?.data?.gap ?? 'var(--spacing-big)';
})();
</script>

<template>
  <Block :element>
    <div
      :style="{ justifyContent: justify, gap }"
      class="flex flex-wrap items-center"
    >
      <template v-for="(item, i) of element.children">
        <div
          :style="{
            flex: element.data?.flexes ? element.data.flexes[i] : undefined,
          }"
        >
          <Render :element="item" />
        </div>
      </template>
    </div>
  </Block>
</template>
