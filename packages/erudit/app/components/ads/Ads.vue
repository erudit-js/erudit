<script lang="ts" setup>
import type { EruditAds } from '@erudit-js/cog/schema';

import { LazyAdsCustom, LazyAdsYandex } from '#components';

const props = defineProps<{ data: EruditAds }>();

const route = useRoute();
watch(() => route.path, updateAds);

const adsKey = ref(0);
const AdsComponent = shallowRef<typeof LazyAdsCustom | typeof LazyAdsYandex>();

function updateAds() {
    AdsComponent.value = (() => {
        switch (props.data?.provider) {
            case 'yandex':
                return LazyAdsYandex;
            case 'custom':
                return LazyAdsCustom;
        }

        return undefined;
    })();
    adsKey.value++;
}

onMounted(() => {
    updateAds();
});
</script>

<template>
    <AdsComponent v-if="AdsComponent" :data="data as any" :key="adsKey" />
</template>
