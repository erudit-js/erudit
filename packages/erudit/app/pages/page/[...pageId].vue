<script setup lang="ts">
const route = useRoute();
const pageId = route.params.pageId;
</script>

<template>
    <h1>Page {{ pageId }}</h1>
</template>
