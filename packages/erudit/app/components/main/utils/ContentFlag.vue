<script lang="ts" setup>
import { computePosition, shift, autoUpdate, arrow } from '@floating-ui/dom';

defineProps<{ icon: string; title: string }>();
</script>

<template>
    <div :class="$style.flag">Content flag</div>
</template>

<style lang="scss" module>
.flag {
    color: red;
}
</style>
