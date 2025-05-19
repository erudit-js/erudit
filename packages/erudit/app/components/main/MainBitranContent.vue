<script lang="ts" setup>
import {
    locationsEqual,
    stringifyBitranLocation,
    type BitranLocation,
} from '@erudit-js/cog/schema';

import type { RawBitranContent } from '@shared/bitran/content';
import ContentSection from '@app/components/main/content/ContentSection.vue';

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
    <ContentSection v-if="payloadValue.biCode">
        <BitranContent :rawContent="payloadValue" />
    </ContentSection>
</template>
