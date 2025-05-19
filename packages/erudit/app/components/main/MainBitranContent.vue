<script lang="ts" setup>
import {
    stringifyBitranLocation,
    type BitranLocation,
} from '@erudit-js/cog/schema';
import type { RawBitranContent } from '@erudit/shared/bitran/content';

const props = defineProps<{ location: BitranLocation }>();

const nuxtApp = useNuxtApp();
const stringLocation = stringifyBitranLocation(props.location);

const payloadKey = `main-bitran-content`;
const payloadValue: RawBitranContent =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
        {});

const payloadStringLocation = (() => {
    if (!payloadValue?.context?.location) {
        return undefined;
    }

    return stringifyBitranLocation(payloadValue.context.location);
})();

if (stringLocation !== payloadStringLocation) {
    const rawBitranContent = await $fetch<RawBitranContent>(
        `/api/bitran/content/${stringLocation}`,
        {
            responseType: 'json',
        },
    );

    Object.assign(payloadValue, rawBitranContent);
}
</script>

<template>
    <BitranContent :rawContent="payloadValue" />
</template>
