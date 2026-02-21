<script lang="ts" setup>
import { h, type Component } from 'vue';
import { mixSchema, textSchema, type ProseElement } from 'tsprose';

import { useAppElement } from '../composables/appElement.js';
import Mix from '../default/Mix.vue';
import Text from '../default/Text.vue';

const { element } = defineProps<{ element: ProseElement }>();

const ElementComponent: Component = await (async () => {
  switch (element.schema.name) {
    case mixSchema.name:
      return Mix;
    case textSchema.name:
      return Text;
  }

  try {
    const appElement = useAppElement(element);
    return await appElement.component();
  } catch (error) {
    console.warn(
      `[Prose] [Render] Missing component for element schema: ${element.schema.name}`,
    );

    return {
      render() {
        return h(
          'span',
          { class: 'text-red-500 font-semibold font-mono' },
          `<${element.schema.name}/>`,
        );
      },
    };
  }
})();
</script>

<template>
  <ElementComponent :element />
</template>
