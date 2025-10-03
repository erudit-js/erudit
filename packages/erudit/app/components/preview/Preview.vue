<script lang="ts" setup>
import {
    LazyPreviewScreenContentPage,
    LazyPreviewScreenDirectLink,
    LazyPreviewScreenUnique,
} from '#components';

const previewElement = useTemplateRef('preview');
const previewScreenElement = useTemplateRef('previewScreen');
const { previewState, closePreview } = usePreview();
const route = useRoute();

watch(() => route.path, closePreview);

const screenComponents: Record<PreviewType, Component> = {
    [PreviewType.DirectLink]: LazyPreviewScreenDirectLink,
    [PreviewType.ContentPage]: LazyPreviewScreenContentPage,
    [PreviewType.Unique]: LazyPreviewScreenUnique,
};

const currentRequest = shallowRef<PreviewRequest>();
const CurrentScreen = shallowRef<Component>();

let resizeObserver: ResizeObserver;
onMounted(() => {
    resizeObserver = new ResizeObserver(resizePreview);
    resizeObserver.observe(previewScreenElement.value!);
});

watch(
    () => previewState.value.request,
    (newRequest) => {
        if (newRequest === undefined) {
            // Still render last request for nice closing animation
            return;
        }

        currentRequest.value = newRequest;
        CurrentScreen.value = screenComponents[newRequest.type];
    },
);

async function delayedResize() {
    /*
        We need to delay because the DOM needs to update before we measure it.
        The height transition speed is fast, so not waiting for actual height might result in
        bad looking "jumps" from previous screen halfway to 0 and then to actual new screen height.
    */
    await nextTick();
    await new Promise((resolve) => setTimeout(resolve, 150));
    resizePreview();
}

function resizePreview() {
    const lastChild = Array.from(
        previewScreenElement.value!.childNodes || [],
    ).pop() as HTMLElement;

    if (lastChild) {
        const newHeight = lastChild?.offsetHeight || 10;
        previewElement.value!.setAttribute('style', `height: ${newHeight}px`);
    }
}

// Prefetch phrases
await usePhrases(
    'book',
    'page',
    'group',
    'topic',
    'article',
    'summary',
    'practice',
    'preview_content_page_description',
);
</script>

<template>
    <div class="sticky top-0 z-100">
        <div
            class="pointer-events-none absolute top-0 right-0 left-0 h-dvh touch-none"
        >
            <div
                ref="preview"
                :class="[
                    'border-border bg-bg-main pointer-events-auto absolute bottom-0 w-full touch-auto overflow-hidden rounded-[25px] rounded-b-none border-t transition-[box-shadow,background,border,max-height,height,translate]',
                    'micro:max-h-[70dvh] max-h-[90dvh]',
                    previewState.opened
                        ? 'translate-y-0 shadow-[0px_-10px_15px_5px_light-dark(rgba(0,0,0,0.1),rgba(255,255,255,0.05))]'
                        : 'translate-y-full shadow-none',
                ]"
            >
                <div ref="previewScreen" class="max-h-[inherit]">
                    <TransitionFade mode="out-in">
                        <Suspense :timeout="0" @resolve="delayedResize">
                            <CurrentScreen
                                v-if="CurrentScreen"
                                :request="currentRequest"
                            />
                            <PreviewLoading v-else />
                            <template #fallback>
                                <PreviewLoading />
                            </template>
                        </Suspense>
                    </TransitionFade>
                </div>

                <!-- Blink overlay -->
                <TransitionFade>
                    <div
                        v-if="previewState.blink"
                        :key="previewState.blink"
                        class="pointer-events-none absolute top-0 left-0 h-full w-full touch-none"
                    >
                        <div
                            class="bg-brand animate-opacity-blink absolute top-0 left-0 h-full w-full opacity-0"
                        ></div>
                    </div>
                </TransitionFade>
            </div>
        </div>
    </div>
</template>
