<script lang="ts" setup>
const { statusVariant } = defineProps<{ statusVariant: SearchStatusVariant }>();
const { icon, message } = statusVariant;

const emit = defineEmits<{
    (e: 'reach'): void;
}>();

const section = useTemplateRef('section');

let observer: IntersectionObserver;

onMounted(() => {
    if (!section.value) {
        return;
    }

    observer = new IntersectionObserver(
        (entries) => {
            for (const entry of entries) {
                if (entry.isIntersecting) {
                    emit('reach');
                }
            }
        },
        { threshold: 0.25 },
    );

    observer.observe(section.value);
});

onUnmounted(() => {
    observer?.disconnect();
});
</script>

<template>
    <section ref="section">
        <div
            v-if="icon || message"
            class="px-normal gap-big text-text-dimmed flex flex-col items-center
                justify-center py-[40px] text-center text-sm"
        >
            <MaybeMyIcon v-if="icon" :name="icon" class="size-[40px]" />
            <p v-if="message">{{ message }}</p>
        </div>
    </section>
</template>
