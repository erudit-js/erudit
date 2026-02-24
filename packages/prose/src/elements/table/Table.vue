<script lang="ts" setup>
import { computed } from 'vue';
import { isProseElement, type ToProseElement } from 'tsprose';

import type { TableSchema } from './core.js';
import { captionSchema } from '../caption/core.js';
import Render from '../../app/shared/Render.vue';
import Block from '../../app/shared/block/Block.vue';
import Caption from '../caption/Caption.vue';

const { element } = defineProps<{
  element: ToProseElement<TableSchema>;
}>();

const caption = computed(() => {
  const maybeCaption = element.children[element.children.length - 1];
  return isProseElement(maybeCaption, captionSchema) ? maybeCaption : undefined;
});

const rows = computed(() =>
  caption.value ? element.children.slice(0, -1) : element.children,
);
</script>

<template>
  <Block :element>
    <div class="nice-scrollbars overflow-auto">
      <table
        :class="[
          $style.table,
          `text-main-sm bg-bg-main m-auto max-w-full border-separate
          border-spacing-[3px] rounded border border-(--tableBorder)`,
        ]"
      >
        <tbody>
          <tr
            v-for="row in rows"
            :key="row.id"
            class="group odd:bg-(--oddCellBg) even:bg-(--evenCellBg)"
          >
            <td
              v-for="cell in row.children"
              :key="cell.id"
              :class="[
                `py-small px-normal group-hocus:inset-ring-(--tableBorder)
                rounded inset-ring-2 inset-ring-transparent
                transition-[box-shadow]`,
                cell.data?.center
                  ? 'text-center'
                  : cell.data?.right
                    ? 'text-right'
                    : '',
                cell.data?.freeze && 'whitespace-nowrap',
              ]"
            >
              <Render
                v-for="inliner of cell.children"
                :key="inliner.id"
                :element="inliner"
              />
            </td>
          </tr>
        </tbody>
      </table>
    </div>
    <Caption v-if="caption" :caption="caption" />
  </Block>
</template>

<style module>
.table {
  --tableBorder: color-mix(
    in srgb,
    var(--color-brand),
    var(--color-border) 75%
  );

  --evenCellBg: color-mix(
    in srgb,
    light-dark(#f5f5f5, #282828),
    var(--color-brand) 5%
  );

  --oddCellBg: color-mix(
    in srgb,
    light-dark(#f5f5f5, #282828),
    var(--color-brand) 8%
  );

  [data-prose-accent] & {
    --tableBorder: color-mix(
      in srgb,
      var(--accentText),
      var(--color-border) 60%
    );

    --evenCellBg: color-mix(
      in srgb,
      light-dark(color-mix(in srgb, #fff, var(--accentText) 13%), #252525),
      var(--accentText) 12%
    );

    --oddCellBg: color-mix(
      in srgb,
      light-dark(color-mix(in srgb, #fff, var(--accentText) 13%), #252525),
      var(--accentText) 19%
    );
  }
}
</style>
