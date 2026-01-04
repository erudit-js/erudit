<script lang="ts" setup>
import type { Quote } from '@erudit-js/core/quote';
import type { MaybeMyIconName } from '#my-icons';

const { quote } = defineProps<{ quote: Quote; hasActions?: boolean }>();
const emit = defineEmits(['next']);

const color = quote.color ?? stringColor(quote.name);

const message = (() => {
    const messages =
        quote.type === 'cameo'
            ? quote.messages
            : (quote.messages ??
              ERUDIT.config.project.sponsors?.defaultSponsorMessages!);

    const randomMessageI = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomMessageI]!;

    return randomMessage;
})();

const icon: MaybeMyIconName = (() => {
    if (quote.type === 'cameo') {
        return quote.icon;
    }

    return quote.icon ?? 'diamond';
})();

function nextClick() {
    emit('next');
    setTimeout(() => {
        nextIcon.value = loadingSvg;
    }, 400);
}

const nextIcon = ref<MaybeMyIconName>('arrow/left');

const phrase = await usePhrases('add_quote', 'next_quote');
</script>

<template>
    <div
        :style="{
            '--color': color,
            '--colorBorder':
                'color-mix(in srgb, var(--color), var(--color-border) 70%)',
            '--colorBg':
                'color-mix(in srgb, var(--color), var(--color-bg-main) 85%)',
            '--colorText':
                'color-mix(in srgb, var(--color), var(--color-text) 85%)',
            '--colorIcon':
                'color-mix(in srgb, var(--color), var(--color-text) 30%)',
        }"
        class="flex gap-[40px]"
    >
        <div class="shrink-0">Icon</div>
        <div
            class="p-small micro:p-normal relative flex-1 rounded
                rounded-tl-none border-2 border-(--colorBorder) bg-(--colorBg)
                transition-[background,border]"
        >
            <div
                class="micro:[--arrowSize:22px] absolute -top-[2px]
                    -left-(--arrowSize) h-(--arrowSize) w-(--arrowSize)
                    bg-(--colorBorder) transition-[background]
                    [--arrowSize:14px]
                    [--arrowSizeSmall:calc(var(--arrowSize)-2px)]
                    [clip-path:polygon(100%_0,100%_100%,0_0)]"
            >
                <div
                    class="absolute top-[2px] -right-[3px] h-(--arrowSizeSmall)
                        w-(--arrowSizeSmall) bg-(--colorBg)
                        transition-[background]
                        [clip-path:polygon(100%_0,100%_100%,0_0)]"
                ></div>
            </div>
            <div class="gap-small flex flex-col font-serif text-(--colorText)">
                <div>{{ formatText(message) }}</div>
                <div
                    class="text-main-sm gap-normal flex flex-wrap font-semibold"
                >
                    <div class="flex-1">
                        <MaybeMyIcon
                            class="relative -top-[1px] mr-1.5 inline
                                text-(--colorIcon)"
                            :name="icon"
                        />
                        <EruditLink
                            v-if="quote.link"
                            external
                            :to="quote.link"
                            target="_blank"
                            class="text-hover-underline"
                        >
                            {{ formatText(quote.name) }}
                        </EruditLink>
                        <span v-else>{{ formatText(quote.name) }}</span>
                        <MyIcon
                            v-if="quote.link"
                            name="arrow/outward"
                            class="micro:text-[8px] micro:-right-2 relative
                                -top-1 -right-1.5 inline text-[6px]
                                text-(--colorText)/40"
                        />
                    </div>
                    <div class="gap-normal flex items-center">
                        <EruditLink
                            :to="PAGES.sponsors"
                            :title="phrase.add_quote"
                            class="hocus:text-(--colorIcon)
                                text-(--colorIcon)/40 transition-[color]"
                        >
                            <MyIcon name="plus" />
                        </EruditLink>
                        <button
                            @click="nextClick"
                            :title="phrase.next_quote"
                            class="hocus:text-(--colorIcon) cursor-pointer
                                text-(--colorIcon)/40 transition-[color]"
                        >
                            <MaybeMyIcon
                                :name="nextIcon"
                                class="-scale-x-100"
                            />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>
