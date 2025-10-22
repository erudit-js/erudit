<script lang="ts" setup>
import { computed } from 'vue';

import type { ParsedElement } from '../../element';
import type { TableSchema } from './table.global';
import {
    Caption as CaptionTag,
    type CaptionSchema,
} from '../caption/caption.global';
import { isElement } from '../../element';
import ProseBlock from '../../app/front/components/ProseBlock.vue';
import Caption from '../caption/Caption.vue';
import Render from '../../app/front/components/Render.vue';

const { element } = defineProps<{ element: ParsedElement<TableSchema> }>();

const caption = computed(() => {
    const maybe = element.children[element.children.length - 1];
    return isElement(maybe, CaptionTag)
        ? (maybe as ParsedElement<CaptionSchema>)
        : undefined;
});

const rows = computed(() =>
    caption.value ? element.children.slice(0, -1) : element.children,
);
</script>

<template>
    <ProseBlock :element="element">
        <div class="nice-scrollbars overflow-auto">
            <table
                :class="[
                    $style.table,
                    `text-main-sm bg-bg-main m-auto max-w-full border-separate
                    border-spacing-[3px] rounded border border-(--tableBorder)
                    transition-[background,border]`,
                ]"
            >
                <tbody>
                    <tr
                        v-for="row in rows"
                        :key="row.domId"
                        class="transition-[background] odd:bg-(--oddCellBg)
                            even:bg-(--evenCellBg)"
                    >
                        <td
                            v-for="cell in row.children"
                            :key="cell.domId"
                            class="py-small px-normal rounded"
                        >
                            <Render
                                v-for="inliner of cell.children"
                                :key="inliner.domId"
                                :element="inliner"
                            />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Caption v-if="caption" :caption="caption" />
    </ProseBlock>
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
