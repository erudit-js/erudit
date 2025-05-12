import type { ShallowRef } from 'vue';
import type { BitranContent } from '@bitran-js/renderer-vue';
import {
    encodeBitranLocation,
    NO_ALIASES,
    setEruditBitranRuntime,
    stringifyBitranLocation,
    type BitranLocation,
} from '@erudit-js/cog/schema';

import type { EruditBitranContent } from '@server/bitran/content';

import eruditConfig from '#erudit/config';

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

        const contentApiRoute = `/api/bitran/content/${encodeBitranLocation(stringifyBitranLocation(location.value!))}`;

        // @ts-ignore
        contentPromise = (async () => {
            const locationString = encodeBitranLocation(
                stringifyBitranLocation(location.value!),
            );

            const payloadKey = `content`;
            const payload =
                (nuxtApp.static.data[payloadKey] ||=
                nuxtApp.payload.data[payloadKey] ||=
                    {});

            let eruditBitranContent: EruditBitranContent;

            if (payload.location === locationString) {
                eruditBitranContent = payload;
            } else {
                eruditBitranContent = await $fetch(contentApiRoute, {
                    responseType: 'json',
                });

                for (const route of eruditBitranContent.routes) {
                    nuxtApp.runWithContext(() => prerenderRoutes([route]));
                }

                // Clear the payload and set new data
                Object.keys(payload).forEach((key) => delete payload[key]);
                Object.assign(payload, {
                    ...eruditBitranContent,
                    location: locationString,
                });
            }

            const bitranTranspiler = await useBitranTranspiler();

            [bitranTranspiler.parser, bitranTranspiler.stringifier].forEach(
                (item) => {
                    setEruditBitranRuntime(item, {
                        eruditConfig,
                        insideInclude: false,
                        context: {
                            aliases: NO_ALIASES(),
                            location: location.value!,
                        },
                    });
                },
            );

            const root = await bitranTranspiler.parser.parse(
                eruditBitranContent.biCode,
            );

            content.value = {
                root,
                renderDataStorage: eruditBitranContent.renderDataStorage,
            };

            return content;
        })();
    });

    return contentPromise!;
}
