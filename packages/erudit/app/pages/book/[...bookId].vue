<script setup lang="ts">
const route = useRoute();
const bookId = route.params.bookId;
</script>

<template>
    <h1>Book {{ bookId }}</h1>
</template>
