<script lang="ts" setup>
import type { PreviewRequestDirectLink } from '@erudit-js/core/preview/request';

defineProps<{ request: PreviewRequestDirectLink }>();

const phrase = await usePhrases('direct_link', 'direct_link_explain');
</script>

<template>
    <PreviewScreen
        icon="link"
        :main="phrase.direct_link"
        :link="request.href"
        :external="true"
    >
        <div
            class="micro:text-base px-(--_pMainX) py-[calc(var(--_pMainY)*2)]
                text-sm"
        >
            <div>{{ phrase.direct_link_explain }}</div>
            <div class="mt-small font-mono wrap-break-word underline">
                {{ request.href }}
            </div>
        </div>
    </PreviewScreen>
</template>
