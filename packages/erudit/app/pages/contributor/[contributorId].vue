<script lang="ts" setup>
const route = useRoute();
const contributorId = computed(() => String(route.params.contributorId));
</script>

<template>
    <h1>Contributor: {{ contributorId }}</h1>
</template>
