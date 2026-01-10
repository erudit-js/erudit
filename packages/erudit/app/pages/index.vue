<script lang="ts" setup>
useAsideMinorNews();

const nuxtApp = useNuxtApp();
const payloadKey = 'index-page';
const indexPage: IndexPage =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
        await $fetch<IndexPage>('/api/indexPage', { responseType: 'json' }));

const logotypeInvertClass = computed(() => {
    if (!indexPage.logotype?.invert) return '';

    if (indexPage.logotype.invert === 'dark') {
        return 'dark:hue-rotate-180 dark:invert-100';
    }

    if (indexPage.logotype.invert === 'light') {
        return 'hue-rotate-180 invert-100 dark:hue-rotate-0 dark:invert-0';
    }

    return '';
});

const phrase = await usePhrases('x_contributors', 'x_sponsors');
</script>

<template>
    <MainGlow />
    <MainSectionPreamble>
        <!-- Logotype -->
        <img
            v-if="indexPage.logotype"
            :src="withBaseUrl(indexPage.logotype.src)"
            :style="{
                'max-width': `min(${indexPage.logotype.maxWidth || '100%'}, 100%)`,
            }"
            :class="[
                'pt-main-half px-main mx-auto block transition-[filter]',
                logotypeInvertClass,
            ]"
        />

        <!-- Main Data -->
        <div
            class="px-main gap-normal py-main flex flex-col items-center
                text-center"
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
                class="gap-small micro:gap-normal micro:text-[1.2em] flex
                    flex-wrap justify-center text-[1.1em]"
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
        </div>

        <!-- Description -->
        <div
            v-if="indexPage.description"
            class="micro:text-justify px-main pb-main text-center"
        >
            {{ formatText(indexPage.description) }}
        </div>

        <!-- Contributors and Sponsors -->
        <div
            v-if="indexPage.contributors || indexPage.sponsors"
            class="px-main pb-main gap-main flex flex-wrap justify-around"
        >
            <IndexPagePersons
                v-if="indexPage.contributors"
                personType="contributor"
                :title="
                    phrase.x_contributors(
                        Object.keys(indexPage.contributors).length,
                    )
                "
                :link="PAGES.contributors"
                :persons="indexPage.contributors"
            />
            <IndexPagePersons
                v-if="indexPage.sponsors"
                personType="sponsor"
                :title="
                    phrase.x_sponsors(Object.keys(indexPage.sponsors).length)
                "
                :link="PAGES.sponsors"
                :persons="indexPage.sponsors"
            />
        </div>
    </MainSectionPreamble>
    <MainContentChildren
        v-if="indexPage.children"
        :children="indexPage.children"
    />
</template>
