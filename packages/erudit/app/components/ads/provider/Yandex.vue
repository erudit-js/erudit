<script lang="ts" setup>
import type { EruditAdsYandex } from '@erudit-js/core/eruditConfig/ads';

declare global {
    interface Window {
        yaContextCb: Array<() => void>;
        __yandexScriptLoaded?: boolean;
        __yandexScriptLoading?: boolean;
    }

    var Ya: any;
}

const props = defineProps<{ data: EruditAdsYandex }>();
const uid = useId();

const loadYandexScript = (): Promise<void> => {
    return new Promise((resolve, reject) => {
        // Script already loaded
        if (window.__yandexScriptLoaded) {
            resolve();
            return;
        }

        // Script is currently loading, wait for it
        if (window.__yandexScriptLoading) {
            const checkLoaded = () => {
                if (window.__yandexScriptLoaded) {
                    resolve();
                } else {
                    setTimeout(checkLoaded, 50);
                }
            };
            checkLoaded();
            return;
        }

        // Load script for the first time
        window.__yandexScriptLoading = true;
        window.yaContextCb = window.yaContextCb || [];

        const script = document.createElement('script');
        script.src = 'https://yandex.ru/ads/system/context.js';
        script.async = true;

        script.onload = () => {
            window.__yandexScriptLoaded = true;
            window.__yandexScriptLoading = false;
            resolve();
        };

        script.onerror = () => {
            window.__yandexScriptLoading = false;
            reject(new Error('Failed to load Yandex context script'));
        };

        document.head.appendChild(script);
    });
};

onMounted(async () => {
    try {
        await loadYandexScript();

        const { binaryTheme } = useTheme();

        window.yaContextCb.push(() => {
            Ya?.Context?.AdvManager?.render({
                blockId: props.data.blockId,
                renderTo: uid,
                darkTheme: binaryTheme.value === 'dark',
            });
        });
    } catch (error) {
        console.error('Failed to load Yandex ads:', error);
    }
});
</script>

<template>
    <div :id="uid">
        <AdsReplacer />
    </div>
</template>
