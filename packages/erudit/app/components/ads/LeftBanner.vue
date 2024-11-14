<script lang="ts" setup>
import eruditConfig from '#erudit/config';
</script>

<template>
    <AdsBannerTemplate
        :bannerId="eruditConfig.ads!.leftBlockId!"
        :class="$style.darkMagicLeft"
    />
</template>

<style lang="scss" module>
@use '$/partials/darkMagic';

.darkMagicLeft {
    --maxHeight: 300px;

    padding: var(--gap);
    border-top: 1px solid var(--border);

    @media (max-height: 1080px) {
        --maxHeight: 200px;
    }

    @media (max-height: 700px) {
        --maxHeight: 100px;
        [my-icon] {
            display: none;
        }
    }

    @media (max-height: 350px) {
        display: none;
    }

    @include darkMagic.replacer {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        gap: var(--gap);
        text-align: center;
        font-size: 0.95em;

        [my-icon] {
            font-size: 46px;
        }
    }
}
</style>
