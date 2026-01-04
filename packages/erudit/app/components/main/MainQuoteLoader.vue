<script lang="ts" setup>
import type { Quote, QuoteIds } from '@erudit-js/core/quote';

const nuxtApp = useNuxtApp();
const payloadKey = 'cameo-ids';
const payloadValue: QuoteIds =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
        await $fetch('/api/quote/ids', { responseType: 'json' }));

function getRandomQuoteId() {
    const randomTypeI = Math.floor(
        Math.random() * Object.keys(payloadValue).length,
    );
    const randomType = Object.keys(payloadValue)[randomTypeI] as keyof QuoteIds;
    const randomIds = payloadValue[randomType]!;
    const randomIdI = Math.floor(Math.random() * randomIds.length);
    const randomId = randomIds[randomIdI];
    return randomId;
}

const quote = shallowRef<Quote>();
const quoteKey = ref(0);

let loadingQuote = false;

async function nextQuote() {
    loadingQuote = true;

    const nextQuoteId = getRandomQuoteId();
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
    <section
        v-if="quote"
        :key="quoteKey"
        class="px-(--_pMainX) py-[calc(var(--_pMainY)/2)]"
    >
        <MainQuote
            :quote
            :hasActions="true"
            @next="!loadingQuote && nextQuote()"
        />
    </section>
</template>
