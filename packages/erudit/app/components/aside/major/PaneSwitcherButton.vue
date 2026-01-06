<script setup lang="ts">
import type { MyIconName } from '#my-icons';

const props = defineProps<{
    pane: AsideMajorPane;
    icon: MyIconName;
    hint: string;
}>();

const asideMajorPane = useAsideMajorPane();

const active = computed(() => {
    return asideMajorPane.value === props.pane;
});
</script>

<template>
    <button
        @click="asideMajorPane = pane"
        :title="hint"
        :class="[
            `group relative flex size-(--_button-size) cursor-pointer
            items-center justify-center transition-[color]`,
            {
                'text-text': active,
                'text-text-muted hocus:text-text': !active,
            },
        ]"
    >
        <MyIcon :name="icon" class="size-[48%]" />
        <!-- Button underline -->
        <div
            class="group-hocus:bg-border absolute right-(--_underline-p)
                bottom-[-2px] left-(--_underline-p) h-[3px] rounded-[20px]
                bg-transparent transition-[background]"
        ></div>
    </button>
</template>
