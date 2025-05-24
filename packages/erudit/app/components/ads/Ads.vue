<script lang="ts" setup>
import type { EruditAds } from '@erudit-js/cog/schema';

import { LazyAdsProviderCustom, LazyAdsProviderYandex } from '#components';

const props = defineProps<{ data: EruditAds }>();
const route = useRoute();

const adsKey = ref(0);
const AdsComponent = shallowRef<Component>();

function updateAds() {
    console.log('Ads Updated');

    AdsComponent.value = (() => {
        switch (props.data?.provider) {
            case 'yandex':
                return LazyAdsProviderYandex;
            case 'custom':
                return LazyAdsProviderCustom;
        }

        return undefined;
    })();
    adsKey.value++;
}

onMounted(() => {
    watch(() => route.path, updateAds, { immediate: true });
});
</script>

<template>
    <AdsComponent v-if="AdsComponent" :data :key="adsKey" />
</template>
