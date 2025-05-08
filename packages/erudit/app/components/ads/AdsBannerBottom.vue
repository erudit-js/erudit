<script setup lang="ts">
import eruditConfig from '#erudit/config';
</script>

<template>
    <section :class="$style.darkMagicBottom">
        <div :class="$style.inner">
            <Ads :data="eruditConfig.ads!.bottom!" />
        </div>
    </section>
</template>

<style lang="scss" module>
.darkMagicBottom {
    padding: var(--_pMainY) var(--_pMainX);

    .inner {
        position: relative;
        max-height: 300px;
    }
}
</style>
