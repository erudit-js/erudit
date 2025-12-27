<script lang="ts" setup>
defineProps<{ description: string | undefined }>();

const formatText = await useFormatText();
</script>

<template>
    <section
        v-if="description"
        class="text-main-lg max-micro:text-center px-(--_pMainX)
            py-[calc(var(--_pMainY)/2)] font-semibold"
    >
        {{ formatText(description) }}
    </section>
</template>
