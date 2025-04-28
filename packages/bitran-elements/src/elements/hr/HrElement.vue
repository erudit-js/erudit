<script lang="ts" setup>
import { type ElementProps } from '@bitran-js/renderer-vue';
import { type HrSchema } from './shared';

defineProps<ElementProps<HrSchema>>();
</script>

<template>
    <hr :class="$style.hr" />
</template>

<style lang="scss" module>
.hr {
    margin-left: var(--_bitran_asideWidth);
    border: none;
    height: 2px;
    border-radius: 5px;
    background-color: var(--bitran_colorBorder);
}
</style>
