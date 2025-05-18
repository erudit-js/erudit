import {
    encodeBitranLocation,
    stringifyBitranLocation,
    type BitranLocation,
} from '@erudit-js/cog/schema';

import type { StringBitranContent } from '@erudit/shared/bitran/stringContent';

interface BitranContentPayload {
    location: string;
    content: StringBitranContent;
}

export async function getBitranContent(
    location: BitranLocation,
): Promise<StringBitranContent> {
    const nuxtApp = useNuxtApp();

    const payloadKey = `bitran-content`;
    const payloadValue: BitranContentPayload =
        (nuxtApp.static.data[payloadKey] ||=
        nuxtApp.payload.data[payloadKey] ||=
            {});

    const encodedLocation = encodeBitranLocation(
        stringifyBitranLocation(location),
    );

    if (payloadValue.location !== encodedLocation) {
        payloadValue.location = encodedLocation;
        payloadValue.content = await $fetch<StringBitranContent>(
            `/api/bitran/content/${encodedLocation}`,
            {
                responseType: 'json',
            },
        );
    }

    return payloadValue.content;
}
