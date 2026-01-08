<script lang="ts" setup>
import type { Quote, QuoteIds } from '@erudit-js/core/quote';

const nuxtApp = useNuxtApp();
const payloadKey = 'quote-ids';
const payloadValue: QuoteIds =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
        await $fetch('/api/quote/ids', { responseType: 'json' }));

// Calculate total number of quotes
const totalQuotes = computed(() => {
    return Object.values(payloadValue).reduce(
        (sum, ids) => sum + (ids?.length ?? 0),
        0,
    );
});

const hasMultipleQuotes = computed(() => totalQuotes.value > 1);

const currentQuoteId = ref<string | undefined>();

function getRandomQuoteId() {
    const allQuoteIds: string[] = [];

    // Collect all quote IDs
    for (const type in payloadValue) {
        const ids = payloadValue[type as keyof QuoteIds];
        if (ids) {
            allQuoteIds.push(...ids);
        }
    }

    // If only one quote exists, return it
    if (allQuoteIds.length === 1) {
        return allQuoteIds[0];
    }

    // Filter out the current quote ID to avoid repetition
    const availableIds = currentQuoteId.value
        ? allQuoteIds.filter((id) => id !== currentQuoteId.value)
        : allQuoteIds;

    // Select a random quote from available ones
    const randomIdI = Math.floor(Math.random() * availableIds.length);
    return availableIds[randomIdI];
}

const quote = shallowRef<Quote>();
const quoteKey = ref(0);

let loadingQuote = false;

async function nextQuote() {
    loadingQuote = true;

    const nextQuoteId = getRandomQuoteId();
    currentQuoteId.value = nextQuoteId;
    const nextQuote = await $fetch(`/api/quote/data/${nextQuoteId}`, {
        responseType: 'json',
    });
    quote.value = nextQuote;
    quoteKey.value++;

    loadingQuote = false;
}

onMounted(() => {
    if (Object.keys(payloadValue).length === 0) {
        return;
    }

    nextQuote();
});
</script>

<template>
    <section v-if="quote" :key="quoteKey" class="px-main py-main-half">
        <MainQuote
            :quote
            :hasBecomeLink="true"
            :hasNextLink="hasMultipleQuotes"
            @next="!loadingQuote && nextQuote()"
        />
    </section>
</template>
