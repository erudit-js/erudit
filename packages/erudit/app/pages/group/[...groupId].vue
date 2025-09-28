<script setup lang="ts">
const route = useRoute();
const groupId = route.params.groupId;
</script>

<template>
    <h1>Group {{ groupId }}</h1>
</template>
