<script lang="ts" setup>
const { asideMinorState } = useAsideMinor();
const mouted = ref(false);
const showLoadingIcon = ref(false);
const loadingIconDelay = 500;
let loadingTimer: ReturnType<typeof setTimeout> | null = null;

onMounted(() => {
    mouted.value = true;
});

watch(
    asideMinorState,
    () => {
        if (loadingTimer) {
            clearTimeout(loadingTimer);
            loadingTimer = null;
        }

        showLoadingIcon.value = false;

        loadingTimer = setTimeout(() => {
            showLoadingIcon.value = true;
        }, loadingIconDelay);
    },
    { immediate: true },
);

onUnmounted(() => {
    if (loadingTimer) {
        clearTimeout(loadingTimer);
    }
});
</script>

<template>
    <div class="absolute top-0 left-0 h-full w-full">
        <TransitionFade>
            <Suspense v-if="mouted" :key="asideMinorState?.type">
                <template #default :timeout="10">
                    <LazyAsideMinorNews
                        v-if="asideMinorState?.type === 'news'"
                    />
                    <LazyAsideMinorContributor
                        v-else-if="asideMinorState?.type === 'contributor'"
                    />
                    <LazyAsideMinorContentContributions
                        v-else-if="
                            asideMinorState?.type === 'content-contributions'
                        "
                    />
                    <LazyAsideMinorContentPage
                        v-else-if="asideMinorState?.type === 'content-page'"
                    />
                    <LazyAsideMinorContentTopic
                        v-else-if="asideMinorState?.type === 'content-topic'"
                    />
                    <div v-else></div>
                </template>
                <template #fallback>
                    <div
                        v-if="showLoadingIcon"
                        class="absolute top-0 left-0 grid h-full w-full
                            place-items-center"
                    >
                        <Loading class="text-text-disabled text-[65px]" />
                    </div>
                    <div v-else></div>
                </template>
            </Suspense>
        </TransitionFade>
    </div>
</template>
