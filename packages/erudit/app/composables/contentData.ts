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

            const contentId = contentRoute.value.contentId;

            const payloadValue = (payload[contentId] ||= await $fetch(
                '/api/content/data',
                { query: { contentId } },
            ));
            data.value = payloadValue as T;
            return data;
        })();
    });

    return promise as any as Promise<Ref<T>>;
}
