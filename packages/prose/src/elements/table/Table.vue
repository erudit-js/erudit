<script lang="ts" setup>
import { computed } from 'vue';
import { isProseElement, type ProseElement } from '@jsprose/core';

import type { tableSchema } from './core.js';
import { captionSchema } from '../caption/core.js';
import Render from '../../app/shared/Render.vue';
import Block from '../../app/shared/block/Block.vue';
import Caption from '../caption/Caption.vue';

const { element } = defineProps<{
    element: ProseElement<typeof tableSchema>;
}>();

const caption = computed(() => {
    const maybeCaption = element.children[element.children.length - 1];
    return isProseElement(maybeCaption, captionSchema)
        ? maybeCaption
        : undefined;
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
                        class="odd:bg-(--oddCellBg) even:bg-(--evenCellBg)"
                    >
                        <td
                            v-for="cell in row.children"
                            :key="cell.id"
                            class="py-small px-normal rounded"
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
        var(--color-border) 85%
    );

    --evenCellBg: color-mix(
        in srgb,
        light-dark(#f5f5f5, #282828),
        var(--color-brand) 3%
    );

    --oddCellBg: color-mix(
        in srgb,
        light-dark(#f5f5f5, #282828),
        var(--color-brand) 10%
    );

    [data-prose-accent] & {
        --tableBorder: color-mix(
            in srgb,
            var(--accentBorder),
            var(--color-border) 50%
        );

        --evenCellBg: color-mix(
            in srgb,
            light-dark(var(--color-bg-main), #202020),
            var(--accentText) 12%
        );

        --oddCellBg: color-mix(
            in srgb,
            light-dark(var(--color-bg-main), #202020),
            var(--accentText) 18%
        );
    }
}
</style>
