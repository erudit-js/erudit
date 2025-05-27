<script lang="ts" setup>
import { type Cameo } from '@erudit-js/cog/schema';

const nuxtApp = useNuxtApp();
const currentCameo = shallowRef<Cameo>();

const payloadKey = 'cameo';
const payloadValue = shallowRef<Record<string, Cameo>>();

async function init() {
    payloadValue.value = nuxtApp.payload.data[payloadKey] ||=
        Object.fromEntries(
            (await $fetch('/api/cameo/ids', { responseType: 'json' })).map(
                (id: string) => [id, null],
            ),
        );

    if (Object.keys(payloadValue.value!).length === 0) {
        return;
    }

    await nextCameo();
}

function getNextCameoId() {
    const cameoIds = Object.keys(payloadValue.value!);
    const randomCameoId = () => {
        return cameoIds[Math.floor(Math.random() * cameoIds.length)]!;
    };

    let nextCameoId = randomCameoId();

    if (cameoIds.length > 1 && currentCameo.value) {
        while (nextCameoId === currentCameo.value.cameoId) {
            nextCameoId = randomCameoId();
        }
    }

    return nextCameoId;
}

async function getCameoData(cameoId: string) {
    if (payloadValue.value![cameoId]) {
        return payloadValue.value![cameoId];
    }

    const cameoData = await $fetch(`/api/cameo/data/${cameoId}`, {
        responseType: 'json',
    });

    payloadValue.value![cameoId] = cameoData;
    return cameoData;
}

async function nextCameo() {
    const nextCameoId = getNextCameoId();
    currentCameo.value = await getCameoData(nextCameoId);
}

onMounted(init);
</script>

<template>
    <section v-if="currentCameo" :class="$style.cameo">
        <MainCameoData
            :key="currentCameo.cameoId"
            :data="currentCameo"
            v-on:next-cameo="nextCameo"
        />
    </section>
</template>

<style lang="scss" module>
.cameo {
    padding: var(--_pMainY) var(--_pMainX);
}
</style>
