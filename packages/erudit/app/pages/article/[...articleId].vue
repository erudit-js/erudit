<script setup lang="ts">
const route = useRoute();
const articleId = route.params.articleId;
</script>

<template>
    <h1>Article {{ articleId }}</h1>
</template>
