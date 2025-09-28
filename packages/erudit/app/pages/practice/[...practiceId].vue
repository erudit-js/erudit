<script setup lang="ts">
const route = useRoute();
const practiceId = route.params.practiceId;
</script>

<template>
    <h1>Practice {{ practiceId }}</h1>
</template>
