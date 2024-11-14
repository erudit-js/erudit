<script lang="ts" setup>
import eruditConfig from '#erudit/config';
</script>

<template>
    <AdsBannerTemplate
        :bannerId="eruditConfig.ads!.bottomBlockId!"
        :class="$style.darkMagicBottom"
    />
</template>

<style lang="scss" module>
@use '$/def/bp';
@use '$/partials/darkMagic';

.darkMagicBottom {
    --maxHeight: 300px;

    padding: var(--_pMainY) var(--_pMainX);
    padding-top: var(--gapBig);

    @include darkMagic.replacer {
        display: flex;
        justify-content: center;
        align-items: center;
        gap: var(--gapBig);
        font-size: 22px;

        [my-icon] {
            font-size: 60px;
        }

        @include bp.below('mobile') {
            flex-direction: column;
            gap: var(--gap);
            font-size: 16px;
            text-align: center;

            [my-icon] {
                font-size: 68px;
            }
        }
    }
}
</style>
