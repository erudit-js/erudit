<script lang="ts" setup>
import type { EruditAdsCustom } from '@erudit-js/cog/schema';

const props = defineProps<{ data: EruditAdsCustom }>();

const randomBanner =
    props.data.banners[Math.floor(Math.random() * props.data.banners.length)]!;
</script>

<template>
    <div :class="$style.darkMagicCustom">
        <a :href="randomBanner.src" target="_blank">
            <img :src="randomBanner.src" />
        </a>
    </div>
</template>

<style lang="scss" module>
.darkMagicCustom {
    max-height: inherit;

    a {
        max-height: inherit;
        display: block;
    }

    img {
        display: block;
        margin: 0 auto;
        max-height: inherit;
        object-fit: contain;
        object-position: center;
    }
}
</style>
