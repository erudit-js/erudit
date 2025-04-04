import type { ShallowRef } from 'vue';
import type { BitranContent } from '@bitran-js/renderer-vue';
import {
    encodeBitranLocation,
    NO_ALIASES,
    setEruditBitranRuntime,
    stringifyBitranLocation,
    type BitranLocation,
} from '@erudit-js/cog/schema';
import type { StringBitranContent } from '@erudit/shared/bitran/stringContent';

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

        const apiRoute = `/api/bitran/content/${encodeBitranLocation(stringifyBitranLocation(location.value!))}`;
        nuxtApp.runWithContext(() => prerenderRoutes(apiRoute));

        // @ts-ignore
        contentPromise = (async () => {
            const stringContent = (await $fetch(apiRoute, {
                responseType: 'json',
            })) as StringBitranContent;

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
                stringContent.biCode,
            );

            content.value = {
                root,
                preRenderData: stringContent.preRenderData,
            };

            return content;
        })();
    });

    return contentPromise!;
}
