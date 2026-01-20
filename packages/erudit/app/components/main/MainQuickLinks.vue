<script lang="ts" setup>
const { elementSnippets } = defineProps<{
    mode: 'single' | 'children';
    elementSnippets?: ElementSnippet[];
}>();

const quickLinks = (() => {
    if (!elementSnippets) {
        return;
    }

    const filtered = elementSnippets.filter((snippet) => !!snippet.quick);

    return filtered.length > 0 ? filtered : undefined;
})();

const phrase = await usePhrases('key_elements');
</script>

<template>
    <template v-if="elementSnippets">
        <section v-if="mode === 'single'" class="px-main py-main-half">
            <MainSubTitle :title="phrase.key_elements + ':'" />
            <div
                :style="{ '--quickBg': 'var(--color-bg-aside)' }"
                class="gap-small micro:gap-normal micro:justify-start flex
                    flex-wrap justify-center"
            >
                <MainQuickLink v-for="quickLink of quickLinks" :quickLink />
            </div>
        </section>
        <div
            v-else
            :style="{ '--quickBg': 'var(--color-bg-main)' }"
            class="gap-small text-main-sm flex flex-wrap"
        >
            <MainQuickLink v-for="quickLink of quickLinks" :quickLink />
        </div>
    </template>
</template>
