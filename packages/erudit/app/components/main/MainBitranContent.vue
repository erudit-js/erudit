<script lang="ts" setup>
import {
    locationsEqual,
    stringifyBitranLocation,
    type BitranLocation,
} from '@erudit-js/cog/schema';

import type { RawBitranContent } from '@shared/bitran/content';

type MainBitranPayload = RawBitranContent & {
    mainLocation: BitranLocation;
};

const props = defineProps<{ location: BitranLocation }>();

const nuxtApp = useNuxtApp();
const stringLocation = stringifyBitranLocation(props.location);

const payloadKey = `main-bitran-content`;
const payloadValue: MainBitranPayload =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
        {});

if (
    !payloadValue.mainLocation ||
    !locationsEqual(payloadValue.mainLocation, props.location)
) {
    const rawBitranContent = await $fetch<RawBitranContent>(
        `/api/bitran/content/${stringLocation}`,
        {
            responseType: 'json',
        },
    );

    Object.assign(payloadValue, rawBitranContent, {
        mainLocation: props.location,
    });
}
</script>

<template>
    <MainSection v-if="payloadValue.biCode" :class="$style.mainBitranContent">
        <template v-if="$slots.header" v-slot:header>
            <slot name="header"></slot>
        </template>
        <BitranContent :rawContent="payloadValue" />
    </MainSection>
</template>

<style lang="scss" module>
.mainBitranContent {
    padding-top: var(--_pMainY);
}
</style>
