<script lang="ts" setup>
defineProps<{ title: string }>();
</script>

<template>
    <div
        class="text-main-sm micro:text-left pb-main-half text-center
            font-semibold"
    >
        {{ formatText(title) }}
    </div>
</template>
