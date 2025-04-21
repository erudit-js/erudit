<script lang="ts" setup>
import {
    useElementParseData,
    Render,
    type ElementProps,
} from '@bitran-js/renderer-vue';

import { type TableSchema } from './shared';
import FigureWrapper from '../../shared/figure/FigureWrapper.vue';
import { maxWidthCSS } from '../../shared/maxWidth';

defineProps<ElementProps<TableSchema>>();
const parseData = useElementParseData<TableSchema>();
</script>

<template>
    <FigureWrapper :caption="parseData.caption">
        <div :class="$style.tableWrapper">
            <table
                :class="$style.table"
                :style="{
                    maxWidth: maxWidthCSS(parseData.maxWidth),
                }"
            >
                <tbody>
                    <tr
                        v-for="(row, rowIndex) in parseData.cells"
                        :key="rowIndex"
                    >
                        <td v-for="(cell, cellIndex) in row" :key="cellIndex">
                            <Render :node="cell" />
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </FigureWrapper>
</template>

<style lang="scss" module>
@use '../../shared/utils' as elementUtils;

.tableWrapper {
    @include elementUtils.scrollbar;
}

.table {
    margin: 0 auto;
    overflow: hidden;
    font-size: 0.94em;

    border: 1px solid
        color-mix(
            in srgb,
            var(--bitran_colorBrand),
            var(--bitran_colorBorder) 85%
        );

    border-radius: 5px;

    --oddTrBg: color-mix(
        in srgb,
        light-dark(#f5f5f5, #282828),
        var(--bitran_colorBrand) 5%
    );

    --evenTrBg: color-mix(
        in srgb,
        light-dark(var(--bgMain), #202020),
        var(--bitran_colorBrand) 5%
    );

    [data-erudit-accent] & {
        border-color: color-mix(
            in srgb,
            var(--accentColor_border),
            var(--bitran_colorBorder) 50%
        );

        --oddTrBg: color-mix(
            in srgb,
            light-dark(#f5f5f5, #282828),
            var(--accentColor_text) 18%
        );

        --evenTrBg: color-mix(
            in srgb,
            light-dark(var(--bgMain), #202020),
            var(--accentColor_text) 18%
        );
    }

    td {
        padding: var(--bitran_gapSmall) var(--bitran_gap);
    }

    tr:nth-child(odd) {
        background: var(--oddTrBg);
    }

    tr:nth-child(even) {
        background: var(--evenTrBg);
    }
}
</style>
