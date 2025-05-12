<script setup lang="ts">
import type { EruditAds } from '@erudit-js/cog/schema';

import eruditConfig from '#erudit/config';

const adsData = ref<EruditAds>();

onMounted(() => {
    const asideAds = eruditConfig.ads!.aside!;

    if (asideAds.provider === 'custom') {
        let banners =
            window.innerHeight <= 700
                ? asideAds.banners.mobile
                : asideAds.banners.full;

        if (!banners) {
            banners = asideAds.banners.full || asideAds.banners.mobile;
        }

        if (!banners) {
            return;
        }

        adsData.value = {
            provider: 'custom',
            banners: banners,
        };
    } else {
        adsData.value = asideAds;
    }
});
</script>

<template>
    <section v-if="adsData" :class="$style.darkMagicAside">
        <div :class="$style.inner">
            <Ads :data="adsData" />
        </div>
    </section>
</template>

<style lang="scss" module>
.darkMagicAside {
    padding: var(--gap);
    border-top: 1px solid var(--border);

    @media (max-height: 500px) {
        display: none;
    }

    .inner {
        position: relative;
        max-height: 300px;

        @media (max-height: 700px) {
            max-height: 100px;
        }
    }
}
</style>
