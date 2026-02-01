<script lang="ts" setup>
const githubIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M16,.39C7.16.39,0,7.55,0,16.39c0,7.07,4.59,13.07,10.94,15.2.8.13,1.06-.37,1.06-.8v-2.7c-4.43.96-5.38-2.14-5.38-2.14-.74-1.86-1.78-2.35-1.78-2.35-1.46-.99.11-.96.11-.96,1.6.11,2.45,1.65,2.45,1.65,1.39,2.43,3.74,1.71,4.66,1.33.14-1.04.56-1.74,1.01-2.14-3.55-.4-7.28-1.78-7.28-7.87,0-1.78.61-3.2,1.65-4.34-.16-.4-.72-2.06.16-4.22,0,0,1.34-.43,4.4,1.63,1.26-.35,2.64-.53,4-.53s2.74.18,4,.53c3.06-2.06,4.4-1.63,4.4-1.63.88,2.16.32,3.82.16,4.22,1.04,1.14,1.65,2.56,1.65,4.34,0,6.11-3.74,7.46-7.31,7.86.58.5,1.1,1.47,1.1,2.96v4.38c0,.43.26.94,1.07.8,6.35-2.14,10.93-8.13,10.93-15.2C32,7.55,24.84.39,16,.39"/></svg>';
const starIcon =
    '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><path d="M10.12,25.46l5.87-3.54,5.87,3.59-1.54-6.71,5.18-4.48-6.81-.61-2.7-6.34-2.7,6.29-6.81.61,5.18,4.52-1.54,6.67ZM16,26.3l-7.74,4.66c-.34.22-.7.31-1.07.28s-.7-.16-.98-.37c-.28-.22-.5-.49-.65-.81-.16-.33-.19-.69-.09-1.1l2.05-8.81L.66,14.23c-.31-.28-.5-.6-.58-.96-.08-.36-.05-.71.07-1.05s.31-.62.56-.84c.25-.22.59-.36,1.03-.42l9.04-.79L14.27,1.87c.16-.37.4-.65.72-.84.33-.19.66-.28,1-.28s.67.09,1,.28c.33.19.57.47.72.84l3.5,8.3,9.04.79c.44.06.78.2,1.03.42.25.22.44.5.56.84.12.34.15.69.07,1.05s-.27.68-.58.95l-6.85,5.92,2.05,8.81c.09.4.06.77-.09,1.1-.16.33-.37.6-.65.81s-.61.34-.98.37c-.37.03-.73-.06-1.07-.28l-7.74-4.66Z"/></svg>';

const pending = ref(true);
const stars = ref<number | null>(null);

const starsFormatted = computed(() => {
    if (stars.value === null) return '';
    const value = stars.value;
    if (value >= 1000) {
        const formatted =
            value >= 10000
                ? Math.floor(value / 1000).toString()
                : (value / 1000).toFixed(1).replace(/\.0$/, '');
        return formatted + 'K';
    }
    return value.toString();
});

onMounted(async () => {
    try {
        const useFakeApi = ERUDIT.config.debug.fakeApi.repository;

        if (useFakeApi) {
            stars.value = 1337;
            return;
        }

        const repository = ERUDIT.config?.repository;

        if (!repository || repository.type !== 'github') {
            return;
        }

        const parts = repository.name.split('/');
        if (parts.length !== 2) return;

        const [owner, repo] = parts;
        const url = `https://api.github.com/repos/${owner}/${repo}`;

        const ghData = await $fetch<any>(url, {
            responseType: 'json',
        });

        if (typeof ghData.stargazers_count === 'number') {
            stars.value = ghData.stargazers_count;
        }
    } finally {
        pending.value = false;
    }
});
</script>

<template>
    <div class="gap-small flex items-center">
        <MyRuntimeIcon :svg="githubIcon" class="size-[16px]" />
        <span>GitHub</span>
        <TransitionFade>
            <span
                v-if="!pending && stars !== null"
                class="gap-small flex items-center"
            >
                <MyRuntimeIcon :svg="starIcon" class="size-[16px]" />
                <span>{{ starsFormatted }}</span>
            </span>
        </TransitionFade>
    </div>
</template>
