<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

const { color = 'var(--color-brand)' } = defineProps<{
  icon: MaybeMyIconName;
  title: string;
  color?: string;
  contentLabel?: string;
}>();
</script>

<template>
  <section
    :style="{
      '--titleColor': color,
      '--iconColor':
        'color-mix(in srgb, var(--titleColor), var(--color-text) 70%)',
    }"
    class="gap-small micro:items-start px-main py-main-half relative flex
      flex-col items-center justify-center leading-none"
  >
    <div
      class="gap-small micro:hidden flex items-center text-[1.1em] font-semibold
        text-(--iconColor)"
    >
      <MaybeMyIcon :name="icon" class="text-[1.2em]" />
      <span class="micro:hidden">{{ contentLabel }}</span>
    </div>
    <h1 class="text-size-h1 max-micro:text-center">
      <span :title="contentLabel" class="mr-normal cursor-help">
        <MaybeMyIcon
          :name="icon"
          class="max-micro:hidden relative -top-[1px] inline cursor-help
            text-[1.1em] text-(--iconColor)"
        />
      </span>
      <FancyBold :text="title" :color="color" />
    </h1>
  </section>
</template>
