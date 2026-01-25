<script lang="ts" setup>
import type { Quote } from '@erudit-js/core/quote';
import type { MaybeMyIconName, MyIconName } from '#my-icons';

const { quote } = defineProps<{
    quote: Quote;
    canJoin?: boolean;
    hasNextLink?: boolean;
}>();
const emit = defineEmits(['next']);

const loadingSvg = useLoadingSvg();

const color = quote.color ?? stringColor(quote.name);

const message = (() => {
    const messages =
        quote.type === 'cameo'
            ? quote.messages
            : [
                  ...(quote.messages ?? []),
                  ...ERUDIT.config.project.sponsors?.defaultSponsorMessages!,
              ];

    const randomMessageI = Math.floor(Math.random() * messages.length);
    const randomMessage = messages[randomMessageI]!;

    return randomMessage;
})();

const avatarUrl = (() => {
    if (quote.type === 'cameo') {
        return withBaseUrl(quote.avatarUrl);
    }

    return quote.avatarUrl
        ? withBaseUrl(quote.avatarUrl)
        : ('diamond' satisfies MyIconName);
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
        class="micro:gap-[40px] flex gap-[30px]"
    >
        <div class="shrink-0">
            <EruditLink
                external
                target="_blank"
                :to="quote.link"
                class="block rounded-full ring-2 ring-(--colorBorder)"
            >
                <SmartMedia
                    :url="avatarUrl"
                    class="border-bg-main micro:size-[60px] size-[40px]
                        rounded-full border-2
                        [box-shadow:0_0_16px_0_var(--color)]
                        [--mediaColor:var(--color)]"
                />
            </EruditLink>
        </div>
        <div
            class="p-small micro:p-normal relative flex-1 rounded
                rounded-tl-none border-2 border-(--colorBorder) bg-(--colorBg)"
        >
            <div
                class="micro:[--arrowSize:22px] absolute -top-[2px]
                    -left-(--arrowSize) h-(--arrowSize) w-(--arrowSize)
                    bg-(--colorBorder) [--arrowSize:14px]
                    [--arrowSizeSmall:calc(var(--arrowSize)-2px)]
                    [clip-path:polygon(110%_0,110%_110%,0_0)]"
            >
                <div
                    class="absolute top-[2px] -right-[3px] h-(--arrowSizeSmall)
                        w-(--arrowSizeSmall) bg-(--colorBg)
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
                            v-if="quote.type === 'cameo' || quote.avatarUrl"
                            class="relative -top-[1.5px] mr-1.5 inline
                                text-(--colorIcon)"
                            :name="quote.icon!"
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
                            class="relative -top-1 -right-1 inline
                                text-(--colorText)/40"
                        />
                    </div>
                    <div
                        v-if="canJoin || hasNextLink"
                        class="gap-normal micro:text-[1.5em] flex items-center
                            text-[1.2em]"
                    >
                        <EruditLink
                            v-if="canJoin"
                            :to="PAGES.sponsors"
                            :title="phrase.add_quote"
                            class="hocus:text-(--colorIcon)
                                text-(--colorIcon)/40 transition-[color]"
                        >
                            <MyIcon name="plus" />
                        </EruditLink>
                        <button
                            v-if="hasNextLink"
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
