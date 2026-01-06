<script lang="ts" setup>
import type { MaybeMyIconName } from '#my-icons';

defineProps<{
    icon: MaybeMyIconName;
    main: string;
    secondary?: string;
    link?: string;
    external?: boolean;
}>();

const { closePreview, hasPreviousRequest, setPreviousPreview } = usePreview();
</script>

<template>
    <div class="flex max-h-[inherit] flex-col">
        <div class="nice-scrollbars flex-1 overflow-auto">
            <slot></slot>
        </div>
        <div
            class="border-border gap-small micro:gap-normal micro:h-[60px] flex
                h-[54px] shrink-0 items-center border-t px-(--_pMainX)
                transition-[border]"
        >
            <MaybeMyIcon
                :name="icon"
                class="text-text-muted micro:text-[34px] shrink-0 text-[30px]"
            />
            <div class="flex flex-1 flex-col justify-center overflow-hidden">
                <div
                    class="micro:text-sm overflow-hidden text-xs font-bold
                        text-nowrap overflow-ellipsis"
                >
                    {{ main }}
                </div>
                <div
                    v-if="secondary"
                    class="text-text-muted text-tiny micro:text-xs
                        overflow-hidden text-nowrap overflow-ellipsis"
                >
                    {{ secondary }}
                </div>
            </div>
            <div class="gap-small flex shrink-0 items-center">
                <PreviewScreenButton
                    :class="hasPreviousRequest ? '' : 'opacity-0'"
                    icon="arrow/left"
                    :external="true"
                    @click="setPreviousPreview"
                />
                <PreviewScreenButton
                    icon="plus"
                    @click="closePreview"
                    :external="true"
                />
                <PreviewScreenButton
                    icon="arrow/outward"
                    :link
                    :external
                    :state="link ? 'brand' : 'disabled'"
                />
            </div>
        </div>
    </div>
</template>
