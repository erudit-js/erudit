<script lang="ts" setup>
const { direction = 'ltr' } = defineProps<{
    direction?: 'ltr' | 'rtl';
}>();
</script>

<template>
    <template v-if="direction === 'ltr'">
        <div class="nice-scrollbars h-full w-full overflow-auto">
            <slot></slot>
        </div>
    </template>
    <template v-else>
        <div dir="rtl" class="nice-scrollbars h-full w-full overflow-auto">
            <div dir="ltr">
                <slot></slot>
            </div>
        </div>
    </template>
</template>
