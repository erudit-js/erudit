import { isTopicPart, type TopicPart } from '@erudit-js/core/content/topic';
import { isContentType, type ContentType } from '@erudit-js/core/content/type';

const fallbackFaviconHref = eruditPublic('favicons/default.svg');

const faviconMimeByExt: Record<string, string> = {
  '.svg': 'image/svg+xml',
  '.png': 'image/png',
  '.ico': 'image/x-icon',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.gif': 'image/gif',
  '.webp': 'image/webp',
  '.bmp': 'image/bmp',
};

function getFaviconMimeType(href: string): string | undefined {
  const pathPart = href.split(/[?#]/)[0] ?? '';
  const dot = pathPart.lastIndexOf('.');
  if (dot === -1) return undefined;
  const ext = pathPart.slice(dot).toLowerCase();
  return faviconMimeByExt[ext];
}

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
      computed(() => {
        const href = withBaseUrl(faviconHref.value);
        const type = getFaviconMimeType(faviconHref.value);
        return {
          key: 'favicon',
          rel: 'icon',
          href,
          ...(type && { type }),
        };
      }),
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
