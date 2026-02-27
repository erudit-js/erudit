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
        `micro:[--switchHeight:50px] micro:gap-small px-small micro:px-normal
        relative -bottom-[2px] flex h-(--switchHeight) items-center gap-1
        overflow-clip rounded rounded-b-none transition-[color]`,
        partData.state === 'missing' &&
          'text-text-disabled/75 cursor-not-allowed',
        partData.state === 'active' && 'text-brand bg-bg-main',
        partData.state === 'inactive' &&
          'text-text-muted hocus:text-text bg-bg-aside',
      ]"
    >
      <div
        :class="[
          'border-border absolute top-0 left-0 h-full w-full rounded-t border-2',
          partData.state === 'active' && 'border-b-transparent',
          partData.state === 'inactive' &&
            'border-b-[color-mix(in_srgb,var(--color-border),var(--color-bg-main)_65%)]',
        ]"
      ></div>
      <div
        v-if="partData.state === 'active'"
        class="from-brand/80 via-brand/10 absolute top-0 left-0 z-0 h-full
          w-full bg-linear-to-b via-5% to-transparent"
      ></div>
      <MyIcon :name="ICONS[partKey]" class="max-micro:mx-1 text-[1.2em]" />
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
