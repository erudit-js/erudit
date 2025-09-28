<script lang="ts" setup>
defineProps<{ request: PreviewRequestDirectLink }>();

const phrase = await usePhrases('direct_link', 'direct_link_explain');
</script>

<template>
    <PreviewScreen icon="link" :main="phrase.direct_link" :link="request.href">
        <div class="p-normal micro:text-base text-sm">
            <div>{{ phrase.direct_link_explain }}</div>
            <div class="mt-small font-mono break-words underline">
                {{ request.href }}
            </div>
        </div>
    </PreviewScreen>
</template>
