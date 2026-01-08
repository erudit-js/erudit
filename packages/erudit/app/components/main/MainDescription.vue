<script lang="ts" setup>
defineProps<{ description: string | undefined }>();
</script>

<template>
    <section
        v-if="description"
        class="text-main-lg max-micro:text-center px-main py-main-half
            font-semibold transition-[color]"
    >
        {{ formatText(description) }}
    </section>
</template>
