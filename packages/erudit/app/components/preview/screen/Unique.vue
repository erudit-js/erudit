<script lang="ts" setup>
await new Promise((resolve) => setTimeout(resolve, 5000));
</script>

<template>
    <PreviewScreen
        icon="arrow/outward"
        main="Unique Screen"
        secondary="This is a unique screen"
    >
        <div class="nice-scrollbars max-h-[inherit] overflow-auto">
            <div class="h-[5000px]">Unique</div>
        </div>
    </PreviewScreen>
</template>
