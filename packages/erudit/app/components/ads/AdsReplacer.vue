<script lang="ts" setup>
const phrase = await usePhrases('ads_replacer');
</script>

<template>
    <div class="max-h-[inherit] overflow-hidden">
        <div class="h-dvh w-dvw"></div>
        <div class="[container-type:size] absolute top-0 left-0 h-full w-full">
            <div
                class="text-text-muted gap-normal @max-[550px]:gap-small flex
                    h-full w-full flex-row items-center justify-center
                    bg-neutral-200
                    shadow-[inset_0px_0px_5px_0px_light-dark(rgba(0,0,0,0.12),rgba(255,255,255,0.08))]
                    transition-[background,color] @max-[550px]:flex-col
                    @max-[550px]:text-center dark:bg-neutral-800"
            >
                <MyIcon
                    name="handshake"
                    class="text-[70px] [@container(max-height:150px)]:hidden"
                />
                <div
                    v-html="phrase.ads_replacer"
                    class="p-small text-lg @max-[550px]:text-sm"
                ></div>
            </div>
        </div>
    </div>
</template>
