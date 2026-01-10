<script lang="ts" setup>
defineProps<{
    mainContent: MainContentTopicPart;
}>();

const asideMinor = useAsideMinor();

asideMinor.value = {
    type: 'article',
    articleId: 'lol',
};
</script>

<template>
    <MainGlow />
    <MainDecoration :decoration="mainContent.decoration" />
    <MainSectionPreamble>
        <MainBreadcrumbs :breadcrumbs="mainContent.breadcrumbs" />
        <MainTitle :icon="ICONS[mainContent.part]" :title="mainContent.title" />
        <MainFlags :flags="mainContent.flags" />
        <MainDescription :description="mainContent.description" />
        <MainQuickLinks mode="single" :quickLinks="mainContent.quickLinks" />
        <MainConnections :connections="mainContent.connections" />
        <MainContentStats mode="single" :stats="mainContent.stats" />
        <div class="h-main-half"></div>
        <MainQuoteLoader />
        <div class="h-main-half"></div>
    </MainSectionPreamble>
    <MainSection>
        <template #header>
            <MainTopicPartSwitch
                :shortContentId="mainContent.shortContentId"
                :parts="mainContent.parts"
                :activePart="mainContent.part"
            />
        </template>
        <template #default>
            <Prose
                :element="mainContent.proseElement"
                :storage="mainContent.storage"
                :urlPath="'/' + mainContent.fullId"
                :useHashUrl="true"
            />
        </template>
    </MainSection>
    <MainSection>
        <AdsBannerBottom v-if="adsBottomAllowed()" />
    </MainSection>
</template>
