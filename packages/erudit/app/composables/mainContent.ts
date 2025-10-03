type PayloadMainContent = {
    contentPath: string;
    mainContent: MainContent;
};

export async function useMainContent<TMainContent extends MainContent>(
    contentPath: string,
) {
    const nuxtApp = useNuxtApp();
    const payloadKey = 'main-content';
    const payloadMainContent: PayloadMainContent =
        (nuxtApp.static.data[payloadKey] ||=
        nuxtApp.payload.data[payloadKey] ||=
            {});

    let mainContentPromise = async () => {
        if (payloadMainContent.contentPath !== contentPath) {
            payloadMainContent.contentPath = contentPath;
            payloadMainContent.mainContent = await $fetch(
                '/api/mainContent/' + contentPath,
                {
                    responseType: 'json',
                },
            );
        }

        return payloadMainContent.mainContent as TMainContent;
    };

    return mainContentPromise();
}
