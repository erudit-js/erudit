<script lang="ts" setup>
const props = defineProps<{
    bannerId: string;
}>();

const { getElementId, registerBanner } = useDarkMagic();
const phrase = await usePhrases('ads_replacer', '_language_code');

onMounted(() => {
    registerBanner(props.bannerId);
});
</script>

<template>
    <section :class="$style.darkMagicContainer">
        <div :id="getElementId(bannerId)">
            <div :class="$style.darkMagicReplacer">
                <MyIcon name="pirate" />
                <div v-html="phrase.ads_replacer"></div>
            </div>
        </div>
    </section>
</template>

<style lang="scss" module>
.darkMagicContainer {
    --maxHeight: 300px;

    > div {
        width: 100%;
        max-height: var(--maxHeight);
    }
}

.darkMagicReplacer {
    max-height: var(--maxHeight);
    height: var(--maxHeight);
    width: 100%;
    background: var(--bgAccent);
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1) inset;
    color: var(--textMuted);

    @include dark {
        box-shadow: 0px 0px 3px 1px rgba(white, 0.025) inset;
    }

    strong {
        color: inherit;
    }
}
</style>
