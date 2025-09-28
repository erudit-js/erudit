<script lang="ts" setup>
import { debounce } from 'perfect-debounce';

const emit = defineEmits<{
    (e: 'search', query: string): void;
}>();

const searchInput = useTemplateRef('searchInput');
const route = useRoute();
const router = useRouter();

const previousQuery = ref('');
const currentQuery = ref('');

const normalizedQuery = computed(() => currentQuery.value.trim());
const urlParamQuery = computed(() => normalizedQuery.value || undefined);

const scheduleEmit = debounce(() => {
    if (normalizedQuery.value !== previousQuery.value) {
        previousQuery.value = normalizedQuery.value;
        emit('search', normalizedQuery.value);
    }
}, 300);

function onWake() {
    searchInput.value?.focus();
}

function initFromUrlParam() {
    const defaultQuery = String(route.query.q || '').trim();
    if (defaultQuery) {
        currentQuery.value = defaultQuery;
        emit('search', currentQuery.value);
    }
}

function insertUrlQuery(q: string | undefined) {
    router.replace({ ...route, query: { ...route.query, q } });
}

watch(normalizedQuery, () => {
    insertUrlQuery(urlParamQuery.value);
    scheduleEmit();
});

onMounted(() => {
    initFromUrlParam();
    onWake();
});

onActivated(() => {
    insertUrlQuery(urlParamQuery.value);
    onWake();
});

onDeactivated(() => {
    insertUrlQuery(undefined);
});

const phrase = await usePhrases('search_the_site');
</script>

<template>
    <section class="border-border flex w-full items-center border-b">
        <input
            ref="searchInput"
            type="text"
            name="search"
            autocomplete="off"
            spellcheck="false"
            :placeholder="phrase.search_the_site"
            v-model="currentQuery"
            class="ps-normal h-[60px] w-full pe-[calc(0.5*var(--spacing-normal))] font-sans text-sm font-[500] outline-none"
        />
        <TransitionFade>
            <div
                v-if="currentQuery"
                @click="currentQuery = ''"
                class="p-normal text-text-dimmed hocus:text-text cursor-pointer ps-[calc(0.5*var(--spacing-normal))] transition-[color]"
            >
                <MyIcon name="plus" class="rotate-45" />
            </div>
        </TransitionFade>
    </section>
</template>
