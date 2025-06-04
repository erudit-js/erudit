<script lang="ts" setup>
import { type Cameo } from '@erudit-js/cog/schema';

const nuxtApp = useNuxtApp();
const currentCameo = shallowRef<Cameo>();

const payloadKey = 'cameo';
const payloadValue = shallowRef<{
    cameos: Record<string, Cameo>;
    sponsorCameos: Record<string, Cameo>;
}>();

async function init() {
    payloadValue.value = nuxtApp.payload.data[payloadKey] ||= {
        cameos: Object.fromEntries(
            (await $fetch('/api/cameo/ids', { responseType: 'json' })).map(
                (id: string) => [id, null],
            ),
        ),
        sponsorCameos: Object.fromEntries(
            (
                await $fetch('/api/sponsor/cameo/ids', { responseType: 'json' })
            ).map((id: string) => [id, null]),
        ),
    };

    if (
        Object.keys(payloadValue.value!.cameos).length === 0 &&
        Object.keys(payloadValue.value!.sponsorCameos).length === 0
    ) {
        return;
    }

    await nextCameo();
}

function getAllAvailableCameos(): Array<{
    id: string;
    type: 'cameo' | 'sponsor';
}> {
    const cameoIds = Object.keys(payloadValue.value!.cameos);
    const sponsorIds = Object.keys(payloadValue.value!.sponsorCameos);

    return [
        ...cameoIds.map((id) => ({ id, type: 'cameo' as const })),
        ...sponsorIds.map((id) => ({ id, type: 'sponsor' as const })),
    ];
}

function getRandomCameoExcluding(
    exclude?: string,
): { id: string; type: 'cameo' | 'sponsor' } | null {
    const availableCameos = getAllAvailableCameos();

    if (availableCameos.length === 0) return null;

    // Filter out the current cameo if we need to exclude it
    const filteredCameos = exclude
        ? availableCameos.filter((cameo) => cameo.id !== exclude)
        : availableCameos;

    // If we only have one cameo and it's the current one, return it anyway
    const targetCameos =
        filteredCameos.length > 0 ? filteredCameos : availableCameos;

    const randomIndex = Math.floor(Math.random() * targetCameos.length);
    return targetCameos[randomIndex]!;
}

function getNextCameoId(): { id: string; type: 'cameo' | 'sponsor' } | null {
    const currentCameoId = currentCameo.value?.cameoId;
    return getRandomCameoExcluding(currentCameoId);
}

async function getCameoData(cameoId: string, type: 'cameo' | 'sponsor') {
    const targetPayload =
        type === 'cameo'
            ? payloadValue.value!.cameos
            : payloadValue.value!.sponsorCameos;

    if (targetPayload[cameoId]) {
        return targetPayload[cameoId];
    }

    const apiPath =
        type === 'cameo'
            ? `/api/cameo/data/${cameoId}`
            : `/api/sponsor/cameo/data/${cameoId}`;

    const cameoData = (await $fetch(apiPath, {
        responseType: 'json',
    })) as Cameo;

    targetPayload[cameoId] = cameoData;
    return cameoData;
}

async function nextCameo() {
    const nextCameoInfo = getNextCameoId();
    if (!nextCameoInfo) return;

    currentCameo.value = await getCameoData(
        nextCameoInfo.id,
        nextCameoInfo.type,
    );
}

const hasMultipleCameos = computed(() => {
    if (!payloadValue.value) return false;

    const totalCameos =
        Object.keys(payloadValue.value.cameos).length +
        Object.keys(payloadValue.value.sponsorCameos).length;
    return totalCameos > 1;
});

onMounted(init);
</script>

<template>
    <section v-if="currentCameo" :class="$style.cameo">
        <MainCameoData
            :key="currentCameo.cameoId"
            :data="currentCameo"
            :hasMultipleCameos
            v-on:next-cameo="nextCameo"
        />
    </section>
</template>

<style lang="scss" module>
.cameo {
    padding: var(--_pMainY) var(--_pMainX);
}
</style>
