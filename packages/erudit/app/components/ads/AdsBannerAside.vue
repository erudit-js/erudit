<script setup lang="ts">
import type { EruditAds } from '@erudit-js/core/eruditConfig/ads';

const adsData = ref<EruditAds>();

onMounted(() => {
    const asideAds = ERUDIT.config.project.ads!.aside!;

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
    <section
        v-if="adsData"
        class="p-small border-border border-t transition-[border]
            [@media(max-height:500px)]:hidden"
    >
        <div
            class="relative max-h-[300px] overflow-hidden
                [@media(max-height:700px)]:max-h-[100px]"
        >
            <Ads :data="adsData" />
        </div>
    </section>
</template>
