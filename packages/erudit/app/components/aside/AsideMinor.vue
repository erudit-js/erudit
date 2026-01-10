<script lang="ts" setup>
import { LazyAsideMinorNews } from '#components';

const asideMinor = useAsideMinor();
const mouted = ref(false);

watchEffect(() => {
    console.log('Aside Minor Pane State Change. New state:', asideMinor.value);
});

onMounted(() => {
    mouted.value = true;
});
</script>

<template>
    <div class="absolute top-0 left-0 h-full w-full">
        <TransitionFade>
            <Suspense>
                <template #default :timeout="0">
                    <LazyAsideMinorNews
                        v-if="mouted && asideMinor?.type === 'news'"
                    />
                    <div v-else></div>
                </template>
                <template #fallback>
                    <div></div>
                </template>
            </Suspense>
        </TransitionFade>
    </div>
</template>
