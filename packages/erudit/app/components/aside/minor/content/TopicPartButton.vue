<script lang="ts" setup>
import type { TopicPart } from '@erudit-js/core/content/topic';

defineProps<{ part: TopicPart; active?: boolean; link?: string }>();

const phrase = await usePhrases('article', 'summary', 'practice');
</script>

<template>
    <EruditLink
        :to="link"
        :class="[
            `gap-small group py-normal relative flex items-center px-2
            transition-[color]`,
            {
                'text-text-disabled cursor-not-allowed': !link,
                'text-text-muted hocus:text-text': !active && link,
                'text-text': active,
            },
        ]"
    >
        <MyIcon :name="ICONS[part]" class="text-[22px]" />
        <span v-if="active" class="font-semibold">{{ phrase[part] }}</span>
        <div
            :class="[
                `absolute -bottom-[2px] left-0 h-[3px] w-full rounded-[20px]
                transition-[background]`,
                {
                    'group-hocus:bg-border bg-transparent': !active && link,
                    'bg-text-muted': active,
                },
            ]"
        ></div>
    </EruditLink>
</template>
