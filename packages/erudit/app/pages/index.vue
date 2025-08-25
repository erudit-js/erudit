<script lang="ts" setup>
onMounted(() => {
    console.log(withFullUrl('/contributor/avatar/test-contributor-1.png'));
});
</script>

<template>
    <h1 class="font-serif dark:text-cyan-500">Hello, Erudit!</h1>
    <img :src="withBaseUrl('/public/project/ava.jpg')" />
    <img :src="withBaseUrl('/contributor/avatar/test-contributor-1.png')" />
</template>
