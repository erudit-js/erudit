<script lang="ts" setup>
const { src, tint = 'color-mix(in hsl, var(--color-brand), transparent 90%)' } =
  defineProps<{
    src: string;
    tint?: string;
  }>();
</script>

<template>
  <div :class="$style.imageTint" :style="{ '--tint': tint }">
    <img :src />
    <img :src />
  </div>
</template>

<style module>
.imageTint {
  position: relative;
  overflow: hidden;

  img {
    width: 100%;
  }

  img:first-child {
    mix-blend-mode: multiply;
  }

  img:last-child {
    position: absolute;
    inset: 0;
    z-index: -1;
    filter: drop-shadow(0px 1000px 0 var(--tint));
    transform: translateY(-1000px);
  }
}
</style>
