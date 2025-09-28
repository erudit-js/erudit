<script setup lang="ts">
const route = useRoute();
const summaryId = route.params.summaryId;
</script>

<template>
    <h1>Summary {{ summaryId }}</h1>
</template>
