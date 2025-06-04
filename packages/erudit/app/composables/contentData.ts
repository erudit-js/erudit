import { trailingSlash } from '@erudit/utils/url';
import type { ContentData } from '@shared/content/data';

export function useContentData<T extends ContentData>() {
    const nuxtApp = useNuxtApp();
    const contentRoute = useContentRoute();

    const payloadKey = 'content-data';
    const payload =
        (nuxtApp.static.data[payloadKey] ||=
        nuxtApp.payload.data[payloadKey] ||=
            {});

    const data = ref<T>();
    let promise: Promise<typeof data> | undefined;

    watchEffect(() => {
        // @ts-ignore
        promise = (async () => {
            if (!contentRoute.value) {
                data.value = undefined;
                return;
            }

            const dataKey = trailingSlash(contentRoute.value.contentId, false);

            const payloadValue = (payload[dataKey] ||= await $fetch(
                '/api/content/data',
                { query: { contentId: dataKey } },
            ));

            data.value = payloadValue as T;
            return data;
        })();
    });

    return promise as any as Promise<Ref<T>>;
}
