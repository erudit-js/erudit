<script lang="ts" setup>
const { src } = defineProps<{
  src: string;
}>();
</script>

<template>
  <div :class="$style.imageTint">
    <img :src />
    <img :src />
  </div>
</template>

<style module>
.imageTint {
  position: relative;
  overflow: hidden;
  isolation: isolate;

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
    filter: drop-shadow(
      0px 1000px 0
        var(--tint, color-mix(in hsl, var(--color-brand), transparent 90%))
    );
    transform: translateY(-1000px);
    opacity: var(--tint-opacity, 1);
    transition: opacity var(--default-transition-timing-function)
      var(--default-transition-duration);
  }
}
</style>
