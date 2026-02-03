<script lang="ts" setup>
import type { EruditAdsCustom } from '@erudit-js/core/eruditConfig/ads';

const props = defineProps<{ data: EruditAdsCustom }>();

const randomBanner =
  props.data.banners[Math.floor(Math.random() * props.data.banners.length)]!;
</script>

<template>
  <div>
    <a :href="randomBanner.link" target="_blank" class="block">
      <img
        :src="randomBanner.src"
        class="mx-auto my-0 block object-contain object-center"
      />
    </a>
  </div>
</template>
