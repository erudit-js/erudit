<script lang="ts" setup>
import type { ToProseElement } from 'tsprose';

import { type ListSchema } from './core.js';
import Render from '../../app/shared/Render.vue';
import Block from '../../app/shared/block/Block.vue';

defineProps<{ element: ToProseElement<ListSchema> }>();
</script>

<template>
  <Block :element>
    <component
      :is="element.data.type"
      class="micro:[--proseGap:18px]"
      :style="{
        '--liBorder':
          'color-mix(in hsl, var(--accentText, var(--color-text-muted)) 50%, var(--color-bg-main))',
        '--liBackground':
          'color-mix(in hsl, var(--accentBackground, var(--color-text-disabled)) 40%, var(--color-bg-main))',
        '--liText': 'var(--accentText, var(--color-text-muted))',
      }"
      v-bind="
        element.data.type === 'ordered'
          ? { start: element.data.start ?? 1 }
          : {}
      "
    >
      <li
        v-for="(listItem, i) of element.children"
        class="relative flex not-last-of-type:mb-(--proseGap)"
      >
        <div
          class="micro:left-[11px] micro:w-[2px] absolute top-[3px] bottom-[5px]
            left-[9px] w-[1px] bg-(--liBorder)"
        ></div>
        <div class="relative shrink-0">
          <div
            class="micro:top-[1.5px] micro:size-[23px] relative top-[3px] flex
              size-[20px] items-center justify-center rounded-full border
              border-(--liBorder) bg-(--liBackground) font-semibold
              text-(--liText)"
          >
            <template v-if="element.data.type === 'ordered'">
              <div class="micro:text-[13px] text-[10px]">
                {{ i + (element.data.start ?? 0) }}
              </div>
            </template>
            <template v-else>
              <div class="size-1.5 rounded-full bg-(--liText)"></div>
            </template>
          </div>
        </div>
        <div class="flex-1">
          <Render v-for="liItem of listItem.children" :element="liItem" />
        </div>
      </li>
    </component>
  </Block>
</template>
