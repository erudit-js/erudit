<script lang="ts" setup>
defineProps<{
    mainContent: MainContentTopicPart;
}>();
</script>

<template>
    <h1>Topic Part {{ mainContent.part }}</h1>
    <div>
        {{ mainContent.breadcrumbs }}
    </div>
    <div>This is common page content for topic parts.</div>
    <Prose
        :element="mainContent.proseElement"
        :storage="mainContent.storage"
        :urlPath="'/' + mainContent.fullId"
        :useHashUrl="true"
    />
</template>
