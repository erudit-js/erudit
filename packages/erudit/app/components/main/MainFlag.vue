<script lang="ts" setup>
import { autoUpdate, shift, useFloating } from '@floating-ui/vue';
import type { MyIconName } from '#my-icons';
import type { ContentFlag } from '@erudit-js/core/content/flags';

interface FlagData {
    icon: MyIconName;
    color: string;
    title: string;
    description: string;
}

const { flag } = defineProps<{ flag: ContentFlag }>();

const phrase = await usePhrases(
    'flag_advanced',
    'flag_advanced_description',
    'flag_dev',
    'flag_dev_description',
    'flag_secondary',
    'flag_secondary_description',
);

const flagsData: Record<ContentFlag, FlagData> = {
    dev: {
        icon: 'construction',
        color: 'light-dark(var(--color-yellow-700),var(--color-yellow-500))',
        title: phrase.flag_dev,
        description: phrase.flag_dev_description,
    },
    advanced: {
        icon: 'asterisk',
        color: 'light-dark(#72189a,#ff94ff)',
        title: phrase.flag_advanced,
        description: phrase.flag_advanced_description,
    },
    secondary: {
        icon: 'puzzle',
        color: 'light-dark(#558a1a,#8bb759)',
        title: phrase.flag_secondary,
        description: phrase.flag_secondary_description,
    },
};

const flagData = flagsData[flag];

const referenceElement = useTemplateRef('reference');
const popupElement = useTemplateRef('popup');
const popupVisible = ref(false);
const showTimeout = ref<ReturnType<typeof setTimeout> | null>(null);

const { floatingStyles } = useFloating(referenceElement, popupElement, {
    placement: 'bottom',
    whileElementsMounted: autoUpdate,
    middleware: [
        shift({
            boundary:
                document?.querySelector('[data-erudit-main]') || undefined,
        }),
    ],
});

const showPopup = () => {
    showTimeout.value = setTimeout(() => {
        popupVisible.value = true;
    }, 400);
};

const hidePopup = () => {
    if (showTimeout.value) {
        clearTimeout(showTimeout.value);
        showTimeout.value = null;
    }
    popupVisible.value = false;
};

onUnmounted(() => {
    if (showTimeout.value) {
        clearTimeout(showTimeout.value);
    }
});
</script>

<template>
    <div
        ref="reference"
        :style="{ '--flagColor': flagData.color }"
        @mouseenter="showPopup"
        @mouseleave="hidePopup"
    >
        <div
            @touchstart="popupVisible ? hidePopup() : showPopup()"
            class="px-small text-main-sm flex cursor-help items-center gap-1
                rounded border border-(--flagColor)/30 bg-(--flagColor)/15 py-1
                text-(--flagColor)"
        >
            <MyIcon :name="flagData.icon" class="text-[1.3em]" />
            <span>{{ formatText(flagData.title) }}</span>
        </div>
        <TransitionFade>
            <div
                v-if="popupVisible"
                :style="floatingStyles"
                ref="popup"
                class="z-10 max-w-[320px] p-2"
            >
                <div
                    class="bg-bg-main rounded border-2 border-(--flagColor)/30
                        shadow-[0_0_14px_var(--flagColor)]/40
                        dark:shadow-[0_0_14px_var(--flagColor)]/20"
                >
                    <div
                        class="p-small bg-linear-60 from-(--flagColor)/5
                            to-(--flagColor)/20 text-(--flagColor)"
                    >
                        <div class="p-small float-right pt-0 pr-0">
                            <MyIcon
                                :name="flagData.icon"
                                class="text-[40px] opacity-30"
                            />
                        </div>
                        <div class="pb-small text-main-sm font-semibold">
                            {{ formatText(flagData.title) }}
                        </div>
                        <div class="text-main-xs">
                            {{ formatText(flagData.description) }}
                        </div>
                    </div>
                </div>
            </div>
        </TransitionFade>
    </div>
</template>
