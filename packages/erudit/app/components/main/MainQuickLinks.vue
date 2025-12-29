<script lang="ts" setup>
defineProps<{ mode: 'single' | 'children'; quickLinks?: QuickLink[] }>();

const phrase = await usePhrases('key_elements');
</script>

<template>
    <template v-if="quickLinks">
        <section
            v-if="mode === 'single'"
            class="px-(--_pMainX) py-[calc(var(--_pMainY)/2)]"
        >
            <MainSubTitle :title="phrase.key_elements + ':'" />
            <div
                class="gap-small micro:gap-normal micro:justify-start flex
                    flex-wrap justify-center"
            >
                <MainQuickLink v-for="quickLink of quickLinks" :quickLink />
            </div>
        </section>
        <div v-else>
            <MainQuickLink v-for="quickLink of quickLinks" :quickLink />
        </div>
    </template>
</template>
