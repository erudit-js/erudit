<script lang="ts" setup>
import { type TopicPart } from '@erudit-js/core/content/topic';

interface TopicPartSwitchData {
    state: 'active' | 'inactive' | 'missing';
    label: string;
    link: string;
}

const { shortContentId, parts, activePart } = defineProps<{
    shortContentId: string;
    parts: TopicPart[];
    activePart: TopicPart;
}>();

const phrase = await usePhrases('article', 'summary', 'practice');

const getPartData = (part: TopicPart): TopicPartSwitchData => ({
    state:
        activePart === part
            ? 'active'
            : parts.includes(part)
              ? 'inactive'
              : 'missing',
    label: phrase[part],
    link: PAGES.topic(part, shortContentId),
});

const data: Record<TopicPart, TopicPartSwitchData> = {
    article: getPartData('article'),
    summary: getPartData('summary'),
    practice: getPartData('practice'),
};
</script>

<template>
    <div
        :style="{ '--switchHeight': '45px' }"
        class="gap-normal flex justify-center"
    >
        <EruditLink
            v-for="(partData, partKey) of data"
            :to="partData.state !== 'missing' ? partData.link : undefined"
            :class="[
                `micro:[--switchHeight:50px] gap-small micro:gap-normal px-small
                micro:px-normal border-border relative -bottom-[2px] flex
                h-(--switchHeight) items-center rounded rounded-b-none border-2
                transition-[border,color,background]`,
                partData.state === 'missing' &&
                    'text-text-disabled/75 border-b-border cursor-not-allowed',
                partData.state === 'active' &&
                    'text-brand bg-bg-main border-b-transparent',
                partData.state === 'inactive' &&
                    `text-text-muted hocus:text-text bg-bg-aside
                    border-b-[color-mix(in_srgb,var(--color-border),var(--color-bg-main)_65%)]`,
            ]"
        >
            <MyIcon
                :name="ICONS[partKey]"
                class="max-micro:text-[18px] max-micro:mx-1"
            />
            <span
                :class="[
                    'micro:inline font-semibold',
                    partData.state !== 'active' && 'max-micro:hidden',
                ]"
                >{{ partData.label }}</span
            >
        </EruditLink>
    </div>
</template>
