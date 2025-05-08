<script lang="ts" setup>
import type { EruditAdsYandex } from '@erudit-js/cog/schema';

declare global {
    interface Window {
        yaContextCb: Array<() => void>;
    }

    var Ya: any;
}

const props = defineProps<{ data: EruditAdsYandex }>();

useHead({
    script: [
        {
            key: '__darkMagicYandexCb',
            innerHTML: 'window.yaContextCb=window.yaContextCb||[]',
        },
        {
            key: '__darkMagicYandexContext',
            src: 'https://yandex.ru/ads/system/context.js',
            async: true,
        },
    ],
});

const uid = useId();

onMounted(() => {
    const theme = useTheme();

    window.yaContextCb.push(() => {
        Ya.Context.AdvManager.render({
            blockId: props.data.blockId,
            renderTo: uid,
            darkTheme: theme.binaryTheme.value === 'dark',
        });
    });
});
</script>

<template>
    <div :id="uid" :class="$style.darkMagicYandex">
        <AdsReplacer />
    </div>
</template>

<style lang="scss" module>
.darkMagicYandex {
    overflow: hidden;
    max-height: inherit;
}
</style>
