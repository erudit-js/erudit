<script lang="ts" setup>
import { useProseContext } from '../../../app/composables/context.js';
import { useFormatText } from '../../../app/composables/formatText.js';
import { useProblemPhrase } from '../composables/phrase.js';
import type { ProblemAttribute, ProblemInfo, ProblemLevel } from '../shared.js';

const { info } = defineProps<{
    info: ProblemInfo;
}>();

const { EruditIcon } = useProseContext();
const formatText = useFormatText();
const phrase = await useProblemPhrase();

const attributeIcons: Record<ProblemAttribute, string> = Object.fromEntries(
    Object.entries(
        // @ts-ignore
        import.meta.glob('../assets/attributes/*.svg', {
            query: 'raw',
            eager: true,
            import: 'default',
        }),
    ).map(([key, value]) => {
        const name = key.split('/').pop()?.replace('.svg', '') ?? key;
        return [name as any, value as string];
    }),
);

const levelEmojies: Record<ProblemLevel, string> = {
    example: '👀',
    easy: '😀',
    medium: '🤔',
    hard: '🤯',
};

const levelColors: Record<ProblemLevel, string> = {
    example: 'light-dark(#1c8baf, #2a9ab8)',
    easy: 'light-dark(#73af00, #79b800)',
    medium: 'light-dark(#db9c00, #ffc01e)',
    hard: 'light-dark(#dc2f51, #ff375f)',
};
</script>

<template>
    <header
        class="micro:flex-row micro:items-center micro:gap-normal gap-small flex
            flex-col flex-wrap p-(--proseAsideWidth) pb-0"
    >
        <h2
            class="text-text-deep text-main-lg flex-1 font-bold
                transition-[color]"
        >
            {{ formatText(info.title) }}
        </h2>
        <div
            class="micro:[--labelHeight:32px] gap-small micro:justify-start
                micro:flex-row flex flex-row-reverse flex-wrap items-center
                justify-end [--labelHeight:28px]"
        >
            <div
                v-for="attribute of info.attributes.sort()"
                :title="phrase[`attribute_explain.${attribute}`]"
                class="border-border/60 bg-bg-main text-main-xs text-text-muted
                    flex h-(--labelHeight) cursor-help items-center gap-1
                    rounded-xl border px-2 shadow
                    shadow-[light-dark(#d9d9d9,#3c3c3c)]
                    transition-[background,border,color,box-shadow]"
            >
                <EruditIcon
                    :name="attributeIcons[attribute]"
                    class="text-[15px]"
                />
                <span>{{ phrase[`attribute.${attribute}`] }}</span>
            </div>
            <div
                :style="{ '--levelColor': levelColors[info.level] }"
                :title="phrase.level_hint"
                class="text-main-xs flex h-(--labelHeight) cursor-help
                    items-center gap-1 rounded-xl border
                    border-(--levelColor)/30 bg-(--levelColor)/10 px-2
                    font-semibold text-(--levelColor) shadow
                    shadow-(color:--levelColor)/25"
            >
                <div class="text-[15px]">
                    {{ levelEmojies[info.level] }}
                </div>
                <div>{{ phrase[`level.${info.level}`] }}</div>
            </div>
        </div>
    </header>
</template>
