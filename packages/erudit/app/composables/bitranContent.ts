import type { ShallowRef } from 'vue';
import type { BitranContent } from '@bitran-js/renderer-vue';

import {
    encodeBitranLocation,
    stringifyBitranLocation,
    type BitranLocation,
} from '@erudit/shared/bitran/location';

export async function useBitranContent(
    location: Ref<BitranLocation | undefined>,
) {
    const nuxtApp = useNuxtApp();
    const content = shallowRef<BitranContent>();

    let contentPromise: Promise<ShallowRef<BitranContent>>;

    watchEffect(() => {
        if (!location.value) {
            // @ts-ignore
            contentPromise = (() => {
                content.value = undefined;
                return content;
            })();
        }

        const apiRoute = `/api/bitran/content/${encodeBitranLocation(stringifyBitranLocation(location.value!))}`;
        nuxtApp.runWithContext(() => prerenderRoutes(apiRoute));
        // @ts-ignore
        contentPromise = (async () => {
            content.value = (await $fetch(apiRoute, {
                responseType: 'json',
            })) as BitranContent;
            return content;
        })();
    });

    return contentPromise!;
}
