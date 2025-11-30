<script lang="ts" setup>
import type { EruditAds } from '@erudit-js/core/eruditConfig/ads';

const adsData = ref<EruditAds>();

onMounted(() => {
    adsData.value = ERUDIT.config.project.ads!.bottom!;
});
</script>

<template>
    <section v-if="adsData" class="px-(--_pMainX) py-(--_pMainY)">
        <div class="relative max-h-[300px] overflow-hidden">
            <Ads :data="adsData" />
        </div>
    </section>
</template>
