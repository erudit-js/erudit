<script lang="ts" setup>
const nuxtApp = useNuxtApp();
const payloadKey = 'index-page';
const indexPage: IndexPage =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
        await $fetch<IndexPage>('/api/indexPage', { responseType: 'json' }));
</script>

<template>
    <MainGlow />
    <div
        class="flex flex-col items-center gap-(--_pMainY) px-(--_pMainX)
            py-(--_pMainY) text-center"
    >
        <h1>
            <FancyBold :text="indexPage.title" class="text-size-h1" />
        </h1>
        <div
            class="micro:text-[1.3em] text-text-muted text-[1.1em]
                font-semibold"
        >
            {{ formatText(indexPage.short) }}
        </div>
        <div
            v-if="indexPage.stats"
            class="gap-small micro:gap-normal micro:text-[1.3em] flex flex-wrap
                justify-center text-[1.1em]"
        >
            <MainContentStatsItemMaterials
                v-if="indexPage.stats.materials"
                :count="indexPage.stats.materials"
                mode="compact"
            />
            <MainContentStatsItemElement
                v-if="indexPage.stats.elements"
                v-for="(count, schemaName) of indexPage.stats.elements"
                :schemaName
                :count
                mode="compact"
            />
        </div>
        <div
            v-if="indexPage.description"
            class="micro:text-justify text-center"
        >
            {{ formatText(indexPage.description) }}
        </div>
    </div>
    <MainContentChildren
        v-if="indexPage.children"
        :children="indexPage.children"
    />
</template>
