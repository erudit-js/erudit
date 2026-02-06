import { isTopicPart, type TopicPart } from '@erudit-js/core/content/topic';
import { isContentType, type ContentType } from '@erudit-js/core/content/type';

const fallbackFaviconHref = eruditPublic('favicons/default.svg');

export const useFaviconHref = () => {
  return useState<string>('favicon-href', () => fallbackFaviconHref);
};

export function useFavicon() {
  const faviconHref = useFaviconHref();

  function showDefaultFavicon() {
    const defaultFaviconHref = ERUDIT.config.favicon?.default;
    faviconHref.value = defaultFaviconHref || fallbackFaviconHref;
  }

  function showContentFavicon(
    args:
      | { type: Exclude<ContentType, 'topic'> }
      | { type: 'topic'; part: TopicPart },
  ) {
    if (args.type === 'topic') {
      const topicPartHref = ERUDIT.config.favicon?.[args.part];
      if (topicPartHref) {
        faviconHref.value = topicPartHref;
        return;
      }
    } else {
      const typeHref = ERUDIT.config.favicon?.[args.type];
      if (typeHref) {
        faviconHref.value = typeHref;
        return;
      }
    }

    showDefaultFavicon();
  }

  return {
    showDefaultFavicon,
    showContentFavicon,
  };
}

export function initFavicon() {
  const withBaseUrl = useBaseUrl();
  const faviconHref = useFaviconHref();
  const { showDefaultFavicon, showContentFavicon } = useFavicon();
  showDefaultFavicon();

  useHead({
    link: [
      computed(() => ({
        key: 'favicon',
        rel: 'icon',
        href: withBaseUrl(faviconHref.value),
      })),
    ],
  });

  const route = useRoute();
  const contentFaviconDelay = 5000;
  let contentFaviconChangeTimeout: ReturnType<typeof setTimeout>;
  let stopWatchingRoute: ReturnType<typeof watch> | undefined;
  onMounted(() => {
    stopWatchingRoute = watch(
      route,
      () => {
        clearTimeout(contentFaviconChangeTimeout);

        const firstPathPart = route.path.split('/')[1];

        if (isTopicPart(firstPathPart)) {
          contentFaviconChangeTimeout = setTimeout(() => {
            showContentFavicon({
              type: 'topic',
              part: firstPathPart,
            });
          }, contentFaviconDelay);
          return;
        }

        if (isContentType(firstPathPart)) {
          contentFaviconChangeTimeout = setTimeout(() => {
            showContentFavicon({
              type: firstPathPart as Exclude<ContentType, 'topic'>,
            });
          }, contentFaviconDelay);
          return;
        }

        showDefaultFavicon();
      },
      { immediate: true },
    );
  });

  onBeforeUnmount(() => {
    clearTimeout(contentFaviconChangeTimeout);
    stopWatchingRoute?.();
  });
}
