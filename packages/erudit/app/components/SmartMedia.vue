<script lang="ts" setup>
import { isMyIcon, type MyIconName } from '#my-icons';
import { computed, ref, watch } from 'vue';

const { url } = defineProps<{ url?: MyIconName | (string & {}) }>();

const mediaType = computed<'icon' | 'image' | 'video' | null>(() => {
    if (!url) {
        return null;
    }

    const extension = url.split('.').pop() || '';

    if (isMyIcon(url)) {
        return 'icon';
    }

    if (['mp4', 'webm', 'ogg'].includes(extension)) {
        return 'video';
    }

    if (['jpg', 'jpeg', 'png', 'gif', 'svg', 'webp'].includes(extension)) {
        return 'image';
    }

    throw new Error(`Unknown media type for URL: ${url}`);
});

const visible = ref(false);
const loaded = ref(false);
const loading = computed(() => !url || !loaded.value || !visible.value);

const mediaElement = useTemplateRef('media');

watch(
    () => url,
    () => {
        loaded.value = false;
    },
);

onMounted(() => {
    const intersectionObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
            visible.value = entry.isIntersecting;
        });
    });

    if (mediaElement.value) {
        intersectionObserver.observe(mediaElement.value);
    }
});
</script>

<template>
    <div
        ref="media"
        class="overflow-hidden"
        :style="{
            '--_mediaColor': 'var(--mediaColor,var(--color-text-disabled))',
        }"
    >
        <div class="relative h-full w-full">
            <TransitionFade>
                <div v-if="loading">
                    <div
                        class="absolute z-10 h-full w-full animate-pulse
                            bg-(--_mediaColor)/50
                            transition-[opacity,background]"
                    ></div>
                </div>
            </TransitionFade>
            <TransitionFade>
                <template v-if="visible">
                    <div
                        v-if="mediaType === 'icon'"
                        class="absolute h-full w-full"
                    >
                        <div
                            class="grid size-full place-items-center
                                bg-(--_mediaColor)/30 text-(--_mediaColor)
                                transition-[color,background]"
                        >
                            <MyIcon
                                @vue:mounted="loaded = true"
                                :name="url as MyIconName"
                                class="h-2/3 w-2/3"
                            />
                        </div>
                    </div>
                    <img
                        v-if="mediaType === 'image'"
                        :src="url"
                        loading="lazy"
                        @load="loaded = true"
                        class="absolute block h-full w-full object-cover"
                    />
                    <video
                        v-else-if="mediaType === 'video'"
                        :src="url"
                        @loadeddata="loaded = true"
                        autoplay
                        muted
                        loop
                        playsinline
                        class="absolute block h-full w-full object-cover"
                    ></video>
                </template>
            </TransitionFade>
        </div>
    </div>
</template>
