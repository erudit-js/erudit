type PayloadMainContent = {
  contentPath: string;
  mainContent: MainContent;
};

export async function useMainContent<TMainContent extends MainContent>(
  contentTypePath: string,
) {
  const nuxtApp = useNuxtApp();
  const payloadKey = 'main-content';
  const payloadMainContent: PayloadMainContent =
    (nuxtApp.static.data[payloadKey] ||=
    nuxtApp.payload.data[payloadKey] ||=
      {});

  let mainContentPromise = async () => {
    if (payloadMainContent.contentPath !== contentTypePath) {
      payloadMainContent.contentPath = contentTypePath;
      payloadMainContent.mainContent = await fetchJson<MainContent>(
        '/api/main/content/' + contentTypePath,
      );
    }

    return payloadMainContent.mainContent as TMainContent;
  };

  return mainContentPromise();
}
