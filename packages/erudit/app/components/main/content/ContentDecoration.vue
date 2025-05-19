<script lang="ts" setup>
defineProps<{ decoration: string }>();
const baseUrlPath = useBaseUrlPath();
</script>

<template>
    <div :class="$style.contentDecoration">
        <img :src="baseUrlPath(contentAsset(decoration))" />
    </div>
</template>

<style lang="scss" module>
.contentDecoration {
    float: right;
    padding: var(--gap) var(--_pMainX) var(--gapBig) var(--gap);

    @media (max-width: 800px) {
        display: none;
    }

    img {
        display: block;
        aspect-ratio: 1;
        width: 100%;
        max-width: 125px;
        max-height: 125px;
    }
}
</style>
