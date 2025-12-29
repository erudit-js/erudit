<script lang="ts" setup>
defineProps<{ title: string }>();

const formatText = await useFormatText();
</script>

<template>
    <div
        class="text-main-sm micro:text-left pb-[calc(var(--_pMainY)/2)]
            text-center font-semibold"
    >
        {{ formatText(title) }}
    </div>
</template>
